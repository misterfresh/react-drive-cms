#!/usr/bin/env python3
"""Make the blurred loading previews for Gallery photos that live in the code.

Run this after adding photos to app/data/myPhotos.js or birds to
app/data/endangered.js:

    python3 scripts/make_previews.py

It writes app/data/photoPreviews.js: a tiny (24px) version of each thumbnail,
shown blurred while the real photo loads. Photos from blog posts get their
previews from build_static.py instead, when the site is published.
Missing previews are fine: those photos simply fade in without one.
"""
import json
import re
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build_static import ROOT, download, preview_uri  # noqa: E402

OUT = ROOT / 'app' / 'data' / 'photoPreviews.js'
USER_AGENT = {'User-Agent': 'ThePurpleClubBlog/1.0 (gallery previews)'}


def existing():
    if not OUT.exists():
        return {}
    match = re.search(r'=\s*(\{.*\})', OUT.read_text(encoding='utf-8'), re.S)
    return json.loads(match.group(1)) if match else {}


def main():
    old = existing()
    previews = {}

    # My photos: every *-thumb.jpg in assets/my-photos
    for thumb in sorted((ROOT / 'assets' / 'my-photos').glob('*-thumb.jpg')):
        key = f'/assets/my-photos/{thumb.name}'
        previews[key] = preview_uri(thumb.read_bytes())

    # Endangered birds: the Commons thumbnails (kept if already made)
    data = (ROOT / 'app' / 'data' / 'endangered.js').read_text(encoding='utf-8')
    for url in re.findall(r'"thumb":\s*"([^"]+)"', data):
        if url in old:
            previews[url] = old[url]
            continue
        try:
            previews[url] = preview_uri(download(url, headers=USER_AGENT))
            print('  made preview for', url.rsplit('/', 1)[-1][:60])
        except Exception as error:  # skip it; the photo still fades in
            print('  skipped', url.rsplit('/', 1)[-1][:60], error)
        time.sleep(2)  # be gentle with Wikimedia

    OUT.write_text(
        '// Made by scripts/make_previews.py - do not edit by hand.\n'
        '// Tiny blurred previews shown while Gallery photos load.\n'
        'export const photoPreviews = '
        + json.dumps(previews, indent=1)
        + '\n',
        encoding='utf-8',
    )
    print(f'Wrote {len(previews)} previews to {OUT.relative_to(ROOT)}')


if __name__ == '__main__':
    main()
