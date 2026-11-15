import { html, useEffect } from '../lib/htm-preact.js'
import { avoidReload } from '../utils/avoidReload.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'

// Full-screen photo viewer.
// items: [{ src, caption?, postTitle?, postUri?, credit?, creditUrl? }],
// index: which one is open.
// Close with the ✕, a click on the backdrop or Escape; ← → to browse.
export const Lightbox = ({ items, index, onChange, onClose }) => {
    const item = items[index]
    const hasMany = items.length > 1
    const go = (step) => onChange((index + step + items.length) % items.length)

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape') onClose()
            if (hasMany && event.key === 'ArrowRight') go(1)
            if (hasMany && event.key === 'ArrowLeft') go(-1)
        }
        window.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            window.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [index, items.length])

    if (!item) return null
    const stop = (event) => event.stopPropagation()

    return html`<div
        class="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        onClick=${onClose}
    >
        <style>
            .lightbox {
                position: fixed;
                inset: 0;
                z-index: 50;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 1.4rem;
                padding: 6rem 2rem 2.4rem;
                background: rgba(12, 6, 16, 0.94);
                cursor: zoom-out;
                animation: fadein 200ms var(--ease) both;
            }
            .lightbox figure {
                display: contents;
            }
            .lightbox img {
                max-width: 100%;
                min-height: 0;
                flex: 0 1 auto;
                object-fit: contain;
                border-radius: var(--radius-sm);
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                cursor: default;
            }
            .lightbox figcaption {
                max-width: 70ch;
                color: rgba(255, 255, 255, 0.85);
                font-family: var(--font-sans);
                font-size: 1.4rem;
                line-height: 1.5;
                text-align: center;
                cursor: default;
            }
            .lightbox figcaption a {
                color: #fff;
                font-weight: 600;
                text-decoration: underline;
                text-underline-offset: 3px;
            }
            .lightbox .lb-button {
                position: absolute;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 4.4rem;
                height: 4.4rem;
                border: 1px solid rgba(255, 255, 255, 0.25);
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                font-size: 1.8rem;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease);
            }
            .lightbox .lb-button:hover {
                background: rgba(255, 255, 255, 0.22);
            }
            .lightbox .lb-close {
                top: 1.6rem;
                right: 1.6rem;
            }
            .lightbox .lb-prev,
            .lightbox .lb-next {
                top: 50%;
                transform: translateY(-50%);
            }
            .lightbox .lb-prev {
                left: 1.6rem;
            }
            .lightbox .lb-next {
                right: 1.6rem;
            }
            .lightbox .lb-count {
                position: absolute;
                top: 2.6rem;
                left: 2rem;
                color: rgba(255, 255, 255, 0.7);
                font-family: var(--font-sans);
                font-size: 1.3rem;
            }
        </style>
        <figure>
            <img src=${item.src} alt=${item.caption ?? ''} onClick=${stop} />
            ${(item.caption || item.postUri || item.credit) &&
            html`<figcaption onClick=${stop}>
                ${item.caption}
                ${item.credit &&
                html`${item.caption ? ' · ' : ''}<a
                        href=${item.creditUrl}
                        target="_blank"
                        rel="noopener"
                        >${item.credit}</a
                    >`}
                ${item.postUri &&
                html`${item.caption ? ' · ' : ''}<a
                        href=${prefixUriIfNeeded(item.postUri)}
                        onClick=${(event) => {
                            onClose()
                            avoidReload(event)
                        }}
                        >From “${item.postTitle}”</a
                    >`}
            </figcaption>`}
        </figure>
        ${hasMany &&
        html`<span class="lb-count">${index + 1} / ${items.length}</span>
            <button
                class="lb-button lb-prev"
                aria-label="Previous photo"
                onClick=${(event) => {
                    stop(event)
                    go(-1)
                }}
            >
                <i class="fa-solid fa-chevron-left" aria-hidden="true" />
            </button>
            <button
                class="lb-button lb-next"
                aria-label="Next photo"
                onClick=${(event) => {
                    stop(event)
                    go(1)
                }}
            >
                <i class="fa-solid fa-chevron-right" aria-hidden="true" />
            </button>`}
        <button class="lb-button lb-close" aria-label="Close photo viewer">
            <i class="fa-solid fa-xmark" aria-hidden="true" />
        </button>
    </div>`
}
