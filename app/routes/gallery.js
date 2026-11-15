import { html, useEffect, useState } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import { Lightbox } from '../components/lightbox.js'
import { Spinner } from '../styles/Spinner.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'

// gallery.json is built daily by scripts/build_static.py from the posts.
export const Gallery = () => {
    const [photos, setPhotos] = useState(null)
    const [openIndex, setOpenIndex] = useState(null)

    useEffect(() => {
        fetch(prefixUriIfNeeded('/gallery.json'))
            .then((response) => (response.ok ? response.json() : []))
            .then((items) =>
                setPhotos(
                    items.map((item) => ({
                        ...item,
                        src: prefixUriIfNeeded(item.src),
                        thumb: prefixUriIfNeeded(item.thumb),
                    }))
                )
            )
            .catch(() => setPhotos([]))
    }, [])

    return html`<style>
            .gallery-intro {
                max-width: 60ch;
                margin: 0 0 3rem;
                color: var(--c-text-muted);
            }
            .gallery-title {
                margin: 1rem 0 0.8rem;
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
            }
            .gallery-grid {
                columns: 3 15rem;
                column-gap: 1.2rem;
            }
            .gallery-grid button {
                display: block;
                width: 100%;
                margin: 0 0 1.2rem;
                padding: 0;
                border: 0;
                border-radius: var(--radius-sm);
                overflow: hidden;
                background: var(--c-surface-2);
                box-shadow: var(--shadow-sm);
                cursor: zoom-in;
                break-inside: avoid;
                transition: transform var(--dur) var(--ease),
                    box-shadow var(--dur) var(--ease);
            }
            .gallery-grid button:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }
            .gallery-grid img {
                display: block;
                width: 100%;
                height: auto;
            }
            .gallery-empty {
                padding: 4rem 0;
                color: var(--c-text-muted);
            }
            .gallery-loading {
                display: flex;
                justify-content: center;
                padding: 6rem 0;
            }
        </style>
        <${Page}
            title="Gallery"
            description="Birds I've met and photographed myself."
            sidebarImage=${photos?.[0]?.src ??
            prefixUriIfNeeded('/assets/harpy_eagle_1.jpg')}
        >
            <h1 class="gallery-title">Gallery</h1>
            <p class="gallery-intro">
                Every photo here was taken by me. Tap one to see it full-size
                and find the post it came from.
            </p>
            ${photos === null
                ? html`<div class="gallery-loading">
                      <${Spinner}
                          stroke="var(--c-brand)"
                          width=${40}
                          height=${40}
                      />
                  </div>`
                : photos.length === 0
                ? html`<p class="gallery-empty">No photos yet.</p>`
                : html`<div class="gallery-grid">
                      ${photos.map(
                          (photo, index) => html`<button
                              key=${photo.src}
                              onClick=${() => setOpenIndex(index)}
                              aria-label=${`Open photo ${index + 1}${
                                  photo.caption ? `: ${photo.caption}` : ''
                              }`}
                          >
                              <img
                                  src=${photo.thumb}
                                  width=${photo.width}
                                  height=${photo.height}
                                  alt=${photo.caption}
                                  loading="lazy"
                              />
                          </button>`
                      )}
                  </div>`}
            ${openIndex !== null &&
            html`<${Lightbox}
                items=${photos}
                index=${openIndex}
                onChange=${setOpenIndex}
                onClose=${() => setOpenIndex(null)}
            />`}
        <//>`
}
