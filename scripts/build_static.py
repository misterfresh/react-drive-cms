#!/usr/bin/env python3
"""Build feed.xml and a link-preview page for every post.

Reads the posts from the same Google Sheet the site uses, then writes:
  - feed.xml                         RSS feed for feed readers
  - articles/<id>/<slug>.html        copy of index.html with that post's
                                     title, description and photo in the
                                     <meta> tags, so shared links show a
                                     proper preview card
  - gallery.json + assets/gallery/   your own photos from the posts, resized,
                                     for the Gallery page. A photo is left
                                     out when the line after it starts with
                                     "Photo source:" (someone else's photo).

GitHub Pages serves /articles/<id>/<slug> from <slug>.html, so post URLs
don't change. Runs daily from .github/workflows/build-static.yml, or by
hand: python3 scripts/build_static.py
"""
import base64
import hashlib
import html
import json
import re
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE_URL = 'https://thepurpleclub.github.io/home'
SITE_TITLE = 'The Purple Club'
SITE_DESCRIPTION = (
    'A personal blog about birds, people and places, '
    'in English, 日本語 and 繁體中文.'
)
IMAGE_URL = 'https://lh3.googleusercontent.com/d/{}=w1200'


def download(url, headers=None, timeout=60, attempts=4):
    """GET a URL, retrying on network hiccups (timeouts, 429/5xx)."""
    request = urllib.request.Request(url, headers=headers or {})
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.read()
        except (urllib.error.URLError, TimeoutError, ConnectionError) as error:
            status = getattr(error, 'code', None)
            retryable = status is None or status == 429 or status >= 500
            if not retryable or attempt == attempts:
                raise
            wait = 5 * attempt
            print(f'  {error} - retrying in {wait}s ({attempt}/{attempts - 1})')
            time.sleep(wait)


def read_conf():
    conf = (ROOT / 'conf.js').read_text(encoding='utf-8')

    def value(key):
        match = re.search(rf"{key}:\s*'([^']*)'", conf)
        if not match:
            raise SystemExit(f'Could not find {key} in conf.js')
        return match.group(1)

    return value('dashboardId'), value('googleApiKey')


def fetch_rows(sheet_id, api_key):
    url = (
        f'https://sheets.googleapis.com/v4/spreadsheets/{sheet_id}'
        f'/values/Posts?alt=json&key={api_key}'
    )
    # Send the site as referrer so this keeps working if the key gets
    # restricted to thepurpleclub.github.io in Google Cloud Console.
    rows = json.loads(download(url, headers={'Referer': SITE_URL + '/'}))['values']
    return rows[1:]  # skip header row


def slug(text, kind):
    """Same as Drive.slug() in app/lib/drive.js. Keep the two in sync."""
    text = text.strip().lower()
    for src, dst in zip('ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;', 'aaaaaeeeeeiiiiooooouuuunc------'):
        text = text.replace(src, dst)
    text = re.sub(r'[^a-z0-9 -]', '', text)
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    if len(text) < 4:
        text = f'{kind}_{text}'
    return text


def parse_date(value):
    """The sheet's "Last Updated" column is M/D/YYYY H:MM:SS."""
    try:
        return datetime.strptime(value.strip(), '%m/%d/%Y %H:%M:%S').replace(
            tzinfo=timezone.utc
        )
    except (AttributeError, ValueError):
        return None


def to_posts(rows):
    posts = []
    for row in rows:
        row = row + [''] * (7 - len(row))
        title, subtitle, category, _, post_id, image_id, updated = row[:7]
        if not post_id or not title:
            continue
        posts.append({
            'id': post_id,
            'title': title,
            'subtitle': subtitle,
            'category': category,
            'image': IMAGE_URL.format(image_id) if image_id else '',
            'date': parse_date(updated),
            'path': f'articles/{post_id}/{slug(title, "article")}',
        })
    posts.sort(
        key=lambda post: post['date'] or datetime.min.replace(tzinfo=timezone.utc),
        reverse=True,
    )
    return posts


def meta_block(title, description, url, image, kind):
    esc = lambda text: html.escape(text or '', quote=True)
    lines = [
        '<!-- meta:start (scripts/build_static.py replaces this block in each post\'s preview page) -->',
        f'<title>{esc(title)}</title>',
        f'<meta name="description" content="{esc(description)}">',
        f'<meta property="og:type" content="{kind}">',
        f'<meta property="og:site_name" content="{SITE_TITLE}">',
        f'<meta property="og:title" content="{esc(title)}">',
        f'<meta property="og:description" content="{esc(description)}">',
        f'<meta property="og:url" content="{esc(url)}">',
        f'<meta property="og:image" content="{esc(image)}">',
        '<meta name="twitter:card" content="summary_large_image">',
        '<!-- meta:end -->',
    ]
    return '\n    '.join(lines)


def write_preview_pages(posts):
    template = (ROOT / 'index.html').read_text(encoding='utf-8')
    pattern = re.compile(r'<!-- meta:start.*?<!-- meta:end -->', re.S)
    if not pattern.search(template):
        raise SystemExit('index.html is missing the <!-- meta:start --> block')

    out_dir = ROOT / 'articles'
    shutil.rmtree(out_dir, ignore_errors=True)  # drop pages of deleted posts
    for post in posts:
        page = pattern.sub(
            lambda _: meta_block(
                f'{post["title"]} - {SITE_TITLE}',
                post['subtitle'] or SITE_DESCRIPTION,
                f'{SITE_URL}/{post["path"]}',
                post['image'] or f'{SITE_URL}/assets/harpy_eagle_1.jpg',
                'article',
            ),
            template,
            count=1,
        )
        target = ROOT / f'{post["path"]}.html'
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(page, encoding='utf-8')


def write_feed(posts):
    esc = lambda text: html.escape(text or '', quote=False)
    items = []
    for post in posts:
        url = f'{SITE_URL}/{post["path"]}'
        description = esc(post['subtitle'])
        if post['image']:
            description = esc(
                f'<p><img src="{post["image"]}" alt=""></p>'
                f'<p>{html.escape(post["subtitle"] or "")}</p>'
            )
        pub_date = (
            f'\n      <pubDate>{format_datetime(post["date"])}</pubDate>'
            if post['date']
            else ''
        )
        items.append(
            f'''    <item>
      <title>{esc(post["title"])}</title>
      <link>{url}</link>
      <guid isPermaLink="false">{post["id"]}</guid>
      <category>{esc(post["category"])}</category>
      <description>{description}</description>{pub_date}
    </item>'''
        )
    latest = next((p['date'] for p in posts if p['date']), None)
    last_build = (
        f'\n    <lastBuildDate>{format_datetime(latest)}</lastBuildDate>' if latest else ''
    )
    feed = f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>{SITE_TITLE}</title>
    <link>{SITE_URL}/</link>
    <description>{esc(SITE_DESCRIPTION)}</description>
    <atom:link href="{SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>{last_build}
{chr(10).join(items)}
  </channel>
</rss>
'''
    (ROOT / 'feed.xml').write_text(feed, encoding='utf-8')


# ---------------------------------------------------------------- gallery

GALLERY_DIR = ROOT / 'assets' / 'gallery'
FULL_SIZE = 1600   # longest edge of the full-screen photo
THUMB_SIZE = 640   # longest edge of the grid thumbnail
MIN_SIZE = 400     # skip small images (icons, emoji, stickers)
SOURCE_LINE = re.compile(r'^\W*(photo|animation|image|picture|gif)?\s*(source|credit)', re.I)


def fetch_doc_html(post_id):
    url = (
        'https://docs.google.com/feeds/download/documents/export/Export'
        f'?id={post_id}&exportFormat=html'
    )
    return download(url, timeout=90).decode('utf-8', errors='replace')


def doc_blocks(doc):
    """Paragraph-level blocks of the doc body, in order: (image srcs, text)."""
    body = doc.split('<body', 1)[-1]
    blocks = []
    for match in re.finditer(r'<(p|h[1-6]|li)\b[^>]*>(.*?)</\1>', body, re.S):
        inner = match.group(2)
        images = re.findall(r'<img\b[^>]*\bsrc="([^"]+)"', inner)
        text = html.unescape(re.sub(r'<[^>]+>', ' ', inner))
        text = re.sub(r'\s+', ' ', text).strip()
        blocks.append((images, text))
    return blocks


def own_photos(doc):
    """Images not credited to someone else, with the line after them as caption."""
    blocks = doc_blocks(doc)
    photos = []
    for index, (images, _) in enumerate(blocks):
        for position, src in enumerate(images):
            following = next((text for _, text in blocks[index:] if text), '')
            if SOURCE_LINE.match(following):
                continue
            # Only the photo right before a line of text gets it as caption
            is_last_in_block = position == len(images) - 1
            later = blocks[index + 1:]
            direct = is_last_in_block and next(
                (not imgs for imgs, text in later if imgs or text), True
            )
            caption = following if direct and len(following) <= 220 else ''
            photos.append((src, caption))
    return photos


def image_bytes(src):
    if src.startswith('data:'):
        return base64.b64decode(src.split(',', 1)[1])
    return download(src)


def resize(data, size, target):
    """Save as JPEG with the longest edge at most `size`. Returns (w, h)."""
    try:
        from PIL import Image, ImageOps
    except ImportError:
        Image = None
    if Image:
        import io
        image = ImageOps.exif_transpose(Image.open(io.BytesIO(data))).convert('RGB')
        image.thumbnail((size, size))
        image.save(target, 'JPEG', quality=82, optimize=True, progressive=True)
        return image.size
    if shutil.which('sips'):  # macOS fallback, no install needed
        with tempfile.NamedTemporaryFile(suffix='.img') as source:
            source.write(data)
            source.flush()
            subprocess.run(
                ['sips', '-Z', str(size), '-s', 'format', 'jpeg',
                 '-s', 'formatOptions', '82', source.name, '--out', str(target)],
                check=True, capture_output=True,
            )
        out = subprocess.run(
            ['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', str(target)],
            check=True, capture_output=True, text=True,
        ).stdout
        width = int(re.search(r'pixelWidth: (\d+)', out).group(1))
        height = int(re.search(r'pixelHeight: (\d+)', out).group(1))
        return width, height
    raise SystemExit('Install Pillow (pip install pillow) to build the gallery')


def image_size(data):
    """Rough size check without decoding: JPEG/PNG headers, else assume big."""
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')
    if data[:2] == b'\xff\xd8':
        i = 2
        while i < len(data) - 9:
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xC0, 0xC1, 0xC2):
                return int.from_bytes(data[i + 7:i + 9], 'big'), int.from_bytes(data[i + 5:i + 7], 'big')
            i += 2 + int.from_bytes(data[i + 2:i + 4], 'big')
    return (MIN_SIZE, MIN_SIZE)


def write_gallery(posts):
    shutil.rmtree(GALLERY_DIR, ignore_errors=True)
    GALLERY_DIR.mkdir(parents=True)
    items = []
    for post in posts:
        try:
            photos = own_photos(fetch_doc_html(post['id']))
        except Exception as error:  # one broken doc shouldn't stop the build
            print(f'  skipped "{post["title"]}": {error}')
            continue
        for src, caption in photos:
            data = image_bytes(src)
            if data[:3] == b'GIF':
                continue  # animations aren't photos
            if max(image_size(data)) < MIN_SIZE:
                continue
            name = hashlib.sha1(data).hexdigest()[:12]
            width, height = resize(data, FULL_SIZE, GALLERY_DIR / f'{name}.jpg')
            resize(data, THUMB_SIZE, GALLERY_DIR / f'{name}-thumb.jpg')
            items.append({
                'src': f'/assets/gallery/{name}.jpg',
                'thumb': f'/assets/gallery/{name}-thumb.jpg',
                'width': width,
                'height': height,
                'caption': caption,
                'postId': post['id'],
                'postTitle': post['title'],
                'postUri': '/' + post['path'],
            })
        print(f'  {post["title"]}: {sum(i["postId"] == post["id"] for i in items)} photos')
    (ROOT / 'gallery.json').write_text(
        json.dumps(items, ensure_ascii=False, indent=1) + '\n', encoding='utf-8'
    )
    return len(items)


def main():
    posts = to_posts(fetch_rows(*read_conf()))
    if not posts:
        raise SystemExit('No posts found in the sheet; leaving files unchanged')
    write_preview_pages(posts)
    write_feed(posts)
    print(f'Built feed.xml and {len(posts)} preview pages')
    print(f'Built gallery.json with {write_gallery(posts)} photos')


if __name__ == '__main__':
    main()
