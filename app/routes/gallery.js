import { html, useEffect, useState } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import { Lightbox } from '../components/lightbox.js'
import { Spinner } from '../styles/Spinner.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { endangeredBirds, statusLabels } from '../data/endangered.js'
import { myPhotos } from '../data/myPhotos.js'

// Photos from app/data/myPhotos.js, shown before the ones from posts
const extraPhotos = myPhotos.map((photo) => ({
    src: `/assets/my-photos/${photo.file}.jpg`,
    thumb: `/assets/my-photos/${photo.file}-thumb.jpg`,
    width: photo.width,
    height: photo.height,
    caption: photo.caption,
}))

// Two sections:
//  - My photos: app/data/myPhotos.js, plus gallery.json (built by
//    scripts/build_static.py from the photos in posts)
//  - Endangered birds: freely licensed photos listed in app/data/endangered.js
export const Gallery = () => {
    // /gallery#endangered opens the second tab directly
    const [tab, setTabState] = useState(
        location.hash === '#endangered' ? 'endangered' : 'mine'
    )
    const setTab = (next) => {
        setTabState(next)
        history.replaceState(
            history.state,
            '',
            location.pathname + location.search + (next === 'endangered' ? '#endangered' : '')
        )
    }
    const [photos, setPhotos] = useState(null)
    const [lightbox, setLightbox] = useState(null)

    useEffect(() => {
        fetch(prefixUriIfNeeded('/gallery.json'))
            .then((response) => (response.ok ? response.json() : []))
            .catch(() => [])
            .then((items) =>
                setPhotos(
                    [...extraPhotos, ...items].map((item) => ({
                        ...item,
                        src: prefixUriIfNeeded(item.src),
                        thumb: prefixUriIfNeeded(item.thumb),
                    }))
                )
            )
    }, [])

    // Filter the endangered birds by IUCN status
    const [statusFilter, setStatusFilter] = useState('all')
    const shownBirds = endangeredBirds.filter(
        (bird) => statusFilter === 'all' || bird.status === statusFilter
    )
    const countOf = (status) =>
        endangeredBirds.filter((bird) => bird.status === status).length
    const filters = [
        ['all', 'All', endangeredBirds.length],
        ['CR', statusLabels.CR, countOf('CR')],
        ['EN', statusLabels.EN, countOf('EN')],
    ]

    const endangeredItems = shownBirds.map((bird) => ({
        src: bird.src,
        caption: `${bird.name} (${bird.scientific}) · ${statusLabels[bird.status]}`,
        credit: `Photo: ${bird.author}, ${bird.license}`,
        creditUrl: bird.page,
    }))

    const open = (items, index) => setLightbox({ items, index })

    return html`<style>
            .gallery-title {
                margin: 1rem 0 0.8rem;
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
            }
            .gallery-tabs {
                display: inline-flex;
                gap: 0.4rem;
                padding: 0.4rem;
                margin: 0.8rem 0 2rem;
                border-radius: 999px;
                background: var(--c-surface-2);
                border: 1px solid var(--c-border);
            }
            .gallery-tabs button {
                padding: 0.7rem 1.8rem;
                border: 0;
                border-radius: 999px;
                background: transparent;
                color: var(--c-text-muted);
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color var(--dur) var(--ease),
                    color var(--dur) var(--ease);
            }
            .gallery-tabs button:hover {
                color: var(--c-text);
            }
            .gallery-tabs button[aria-selected='true'] {
                background: var(--c-surface);
                color: var(--c-brand);
                box-shadow: var(--shadow-sm);
            }
            .gallery-intro {
                max-width: 62ch;
                margin: 0 0 2.8rem;
                color: var(--c-text-muted);
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
            .status-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 0.8rem;
                margin: 0 0 2rem;
            }
            .status-filter {
                display: inline-flex;
                align-items: center;
                gap: 0.6rem;
                padding: 0.6rem 1.4rem;
                border: 1px solid var(--c-border);
                border-radius: 999px;
                background: var(--c-surface);
                color: var(--c-text);
                font-family: var(--font-sans);
                font-size: 1.3rem;
                font-weight: 500;
                cursor: pointer;
                transition: border-color var(--dur) var(--ease),
                    background-color var(--dur) var(--ease);
            }
            .status-filter:hover {
                border-color: var(--c-brand);
            }
            .status-filter .count {
                padding: 0 0.7rem;
                border-radius: 999px;
                background: var(--c-surface-2);
                font-size: 1.15rem;
                font-weight: 600;
            }
            .status-filter[aria-pressed='true'] {
                border-color: var(--c-brand);
                background: var(--c-brand-soft);
                color: var(--c-brand);
            }
            .species-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(24rem, 1fr));
                gap: 1.6rem;
            }
            .species-card {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                background: var(--c-surface);
                box-shadow: var(--shadow-sm);
            }
            .species-card .photo {
                position: relative;
                display: block;
                padding: 0;
                border: 0;
                aspect-ratio: 4 / 3;
                overflow: hidden;
                background: var(--c-surface-2);
                cursor: zoom-in;
            }
            .species-card .photo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 600ms var(--ease);
            }
            .species-card .photo:hover img {
                transform: scale(1.05);
            }
            .species-card .status {
                position: absolute;
                top: 1rem;
                left: 1rem;
                padding: 0.3rem 1rem;
                border-radius: 999px;
                font-family: var(--font-sans);
                font-size: 1.15rem;
                font-weight: 700;
                letter-spacing: 0.04em;
                color: #fff;
                box-shadow: var(--shadow-sm);
            }
            .species-card .status-CR {
                background: #b3261e;
            }
            .species-card .status-EN {
                background: #c25a00;
            }
            .species-card .body {
                display: flex;
                flex-direction: column;
                flex: 1;
                padding: 1.6rem 1.8rem 1.6rem;
            }
            .species-card h2 {
                margin: 0;
                font-size: 2rem;
                font-weight: 600;
            }
            .species-card .scientific {
                margin: 0 0 0.4rem;
                font-size: 1.4rem;
                font-style: italic;
                color: var(--c-text-muted);
            }
            .species-card .region {
                margin: 0 0 1rem;
                font-family: var(--font-sans);
                font-size: 1.3rem;
                color: var(--c-text-muted);
            }
            .species-card .fact {
                margin: 0 0 1.4rem;
                font-size: 1.5rem;
                line-height: 1.65;
            }
            .species-card .credit {
                margin: auto 0 0;
                font-family: var(--font-sans);
                font-size: 1.15rem;
                color: var(--c-text-muted);
            }
            .species-card .credit a {
                color: inherit;
                text-decoration: underline;
                text-underline-offset: 2px;
            }
            .gallery-source {
                margin: 2.4rem 0 0;
                font-family: var(--font-sans);
                font-size: 1.3rem;
                color: var(--c-text-muted);
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
            description="Birds I've met and photographed myself, and endangered birds that need our help."
            sidebarImage=${photos?.[0]?.src ??
            prefixUriIfNeeded('/assets/harpy_eagle_1.jpg')}
        >
            <h1 class="gallery-title">Gallery</h1>
            <div class="gallery-tabs" role="tablist">
                <button
                    role="tab"
                    aria-selected=${tab === 'mine'}
                    onClick=${() => setTab('mine')}
                >
                    My photos
                </button>
                <button
                    role="tab"
                    aria-selected=${tab === 'endangered'}
                    onClick=${() => setTab('endangered')}
                >
                    Endangered birds
                </button>
            </div>

            ${tab === 'mine'
                ? html`<p class="gallery-intro">
                          Every photo here was taken by me. Tap one to see it
                          full-size.
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
                                        onClick=${() => open(photos, index)}
                                        aria-label=${`Open photo ${index + 1}${
                                            photo.caption
                                                ? `: ${photo.caption}`
                                                : ''
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
                            </div>`}`
                : html`<p class="gallery-intro">
                          These birds are Endangered or Critically Endangered
                          on the IUCN Red List. The photos aren't mine: they're
                          freely licensed photos from Wikimedia Commons, credited
                          to each photographer.
                      </p>
                      ${endangeredBirds.length === 0
                          ? html`<p class="gallery-empty">Coming soon.</p>`
                          : html`<div class="status-filters" role="group" aria-label="Filter by status">
                                ${filters.map(
                                    ([value, label, count]) => html`<button
                                        key=${value}
                                        class="status-filter status-filter-${value}"
                                        aria-pressed=${statusFilter === value}
                                        onClick=${() => setStatusFilter(value)}
                                    >
                                        ${label} <span class="count">${count}</span>
                                    </button>`
                                )}
                            </div>
                            <div class="species-grid">
                                ${shownBirds.map(
                                    (bird, index) => html`<article
                                        class="species-card"
                                        key=${bird.name}
                                    >
                                        <button
                                            class="photo"
                                            onClick=${() =>
                                                open(endangeredItems, index)}
                                            aria-label=${`Open photo of the ${bird.name}`}
                                        >
                                            <img
                                                src=${bird.thumb}
                                                alt=${bird.name}
                                                loading="lazy"
                                                referrerpolicy="no-referrer"
                                            />
                                            <span
                                                class="status status-${bird.status}"
                                                title=${statusLabels[
                                                    bird.status
                                                ]}
                                                >${statusLabels[bird.status]}</span
                                            >
                                        </button>
                                        <div class="body">
                                            <h2>${bird.name}</h2>
                                            <p class="scientific">
                                                ${bird.scientific}
                                            </p>
                                            <p class="region">
                                                <i
                                                    class="fa-solid fa-location-dot"
                                                    aria-hidden="true"
                                                />
                                                ${' '}${bird.region}
                                            </p>
                                            <p class="fact">${bird.fact}</p>
                                            <p class="credit">
                                                Photo:${' '}
                                                <a
                                                    href=${bird.page}
                                                    target="_blank"
                                                    rel="noopener"
                                                    >${bird.author}</a
                                                >,${' '}
                                                <a
                                                    href=${bird.licenseUrl}
                                                    target="_blank"
                                                    rel="noopener"
                                                    >${bird.license}</a
                                                >
                                            </p>
                                        </div>
                                    </article>`
                                )}
                            </div>
                            <p class="gallery-source">
                                Conservation status from the${' '}
                                <a
                                    href="https://www.iucnredlist.org/"
                                    target="_blank"
                                    rel="noopener"
                                    >IUCN Red List</a
                                >.
                            </p>`}`}
            ${lightbox &&
            html`<${Lightbox}
                items=${lightbox.items}
                index=${lightbox.index}
                onChange=${(index) => setLightbox({ ...lightbox, index })}
                onClose=${() => setLightbox(null)}
            />`}
        <//>`
}
