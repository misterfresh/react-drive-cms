#!/usr/bin/env python3
"""Build feed.xml and a link-preview page for every post.

Reads the posts from the same Google Sheet the site uses, then writes:
  - feed.xml                         RSS feed for feed readers
  - articles/<id>/<slug>.html        copy of index.html with that post's
                                     title, description and photo in the
                                     <meta> tags, so shared links show a
                                     proper preview card

GitHub Pages serves /articles/<id>/<slug> from <slug>.html, so post URLs
don't change. Runs daily from .github/workflows/build-static.yml, or by
hand: python3 scripts/build_static.py
"""
import html
import json
import re
import shutil
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
    request = urllib.request.Request(url, headers={'Referer': SITE_URL + '/'})
    with urllib.request.urlopen(request, timeout=30) as response:
        rows = json.load(response)['values']
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


def main():
    posts = to_posts(fetch_rows(*read_conf()))
    if not posts:
        raise SystemExit('No posts found in the sheet; leaving files unchanged')
    write_preview_pages(posts)
    write_feed(posts)
    print(f'Built feed.xml and {len(posts)} preview pages')


if __name__ == '__main__':
    main()
