import { html, useEffect, useRef, useState } from '../lib/htm-preact.js'
import { Page } from '../components/layout/page.js'
import { BirdCall } from '../components/birdCall.js'
import { birds, sightings, getBird } from '../data/birds.js'
import { useCategoriesAndArticles } from '../hooks/useCategoriesAndArticles.js'
import prefixUriIfNeeded from '../utils/prefixUriIfNeeded.js'
import { avoidReload } from '../utils/avoidReload.js'

const LEAFLET = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/'

// Load Leaflet only when this page is opened.
let leafletPromise = null
const loadLeaflet = () => {
    if (window.L) return Promise.resolve(window.L)
    if (!leafletPromise) {
        leafletPromise = new Promise((resolve, reject) => {
            const css = document.createElement('link')
            css.rel = 'stylesheet'
            css.href = LEAFLET + 'leaflet.min.css'
            document.head.appendChild(css)
            const script = document.createElement('script')
            script.src = LEAFLET + 'leaflet.min.js'
            script.onload = () => resolve(window.L)
            script.onerror = () => {
                leafletPromise = null
                reject(new Error('Could not load the map'))
            }
            document.head.appendChild(script)
        })
    }
    return leafletPromise
}

const escapeHtml = (text = '') =>
    text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

export const Sightings = () => {
    const mapElement = useRef(null)
    const map = useRef(null)
    const markers = useRef([])
    const [error, setError] = useState('')
    const [selected, setSelected] = useState(null)
    const { articles } = useCategoriesAndArticles()

    useEffect(() => {
        let cancelled = false
        loadLeaflet()
            .then((L) => {
                if (cancelled || !mapElement.current) return
                map.current = L.map(mapElement.current, {
                    scrollWheelZoom: false,
                })
                L.tileLayer(
                    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                    {
                        maxZoom: 19,
                        attribution:
                            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    }
                ).addTo(map.current)

                const icon = L.divIcon({
                    className: 'bird-pin',
                    html: '<i class="fa-solid fa-feather"></i>',
                    iconSize: [34, 34],
                    iconAnchor: [17, 17],
                    popupAnchor: [0, -18],
                })
                markers.current = sightings.map((sighting, index) => {
                    const bird = getBird(sighting.birdId)
                    return L.marker([sighting.lat, sighting.lng], { icon })
                        .addTo(map.current)
                        .bindPopup(
                            `<strong>${escapeHtml(bird?.name)}</strong><br>` +
                                `${escapeHtml(sighting.place)}` +
                                (sighting.date
                                    ? `<br><span class="pin-date">${escapeHtml(sighting.date)}</span>`
                                    : '')
                        )
                        .on('click', () => setSelected(index))
                })
                if (sightings.length) {
                    map.current.fitBounds(
                        sightings.map((s) => [s.lat, s.lng]),
                        { padding: [60, 60], maxZoom: 15 }
                    )
                } else {
                    map.current.setView([30, 0], 2)
                }
            })
            .catch((loadError) => setError(loadError.message))
        return () => {
            cancelled = true
            map.current?.remove()
            map.current = null
        }
    }, [])

    const focus = (index) => {
        setSelected(index)
        const sighting = sightings[index]
        map.current?.flyTo([sighting.lat, sighting.lng], 16, { duration: 0.8 })
        markers.current[index]?.openPopup()
        mapElement.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    return html`<style>
            .sightings-title {
                margin: 1rem 0 0.8rem;
                font-size: clamp(2.8rem, 2.2rem + 1.4vw, 3.6rem);
                font-weight: 600;
            }
            .sightings-intro {
                max-width: 60ch;
                margin: 0 0 2.4rem;
                color: var(--c-text-muted);
            }
            .sightings-map {
                height: clamp(32rem, 55vh, 56rem);
                margin-bottom: 3.2rem;
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                box-shadow: var(--shadow-sm);
                overflow: hidden;
                background: var(--c-surface-2);
                z-index: 0;
            }
            .sightings-map .leaflet-popup-content {
                font-family: var(--font-sans);
                font-size: 1.4rem;
                line-height: 1.5;
            }
            .sightings-map .pin-date {
                color: #6e6577;
            }
            .bird-pin {
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #fff;
                border-radius: 50%;
                background: var(--c-brand);
                color: var(--c-on-brand);
                font-size: 1.4rem;
                box-shadow: var(--shadow-md);
            }
            .sightings-error {
                color: var(--c-danger);
            }
            .sightings-list {
                display: grid;
                gap: 1.2rem;
                margin: 0;
                padding: 0;
                list-style: none;
            }
            .sighting {
                padding: 1.8rem 2rem;
                border: 1px solid var(--c-border);
                border-radius: var(--radius);
                background: var(--c-surface);
                transition: border-color var(--dur) var(--ease),
                    box-shadow var(--dur) var(--ease);
            }
            .sighting.selected {
                border-color: var(--c-brand);
                box-shadow: 0 0 0 3px var(--c-brand-soft);
            }
            .sighting h2 {
                margin: 0 0 0.2rem;
                font-size: 2rem;
                font-weight: 600;
            }
            .sighting .where {
                margin: 0 0 0.8rem;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                color: var(--c-text-muted);
            }
            .sighting .note {
                margin: 0 0 1.2rem;
                font-size: 1.6rem;
            }
            .sighting .actions {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 1rem 1.6rem;
                font-family: var(--font-sans);
                font-size: 1.4rem;
                font-weight: 600;
            }
            .sighting .show-on-map {
                padding: 0;
                border: 0;
                background: none;
                color: var(--c-brand);
                font: inherit;
                cursor: pointer;
            }
        </style>
        <${Page}
            title="Sightings"
            description="Where I've met the birds on this site. ~Photo: Grey heron by Andreas Trepte, CC BY-SA 2.5, Wikimedia Commons"
            sidebarImage=${prefixUriIfNeeded('/assets/grey_heron.jpg')}
        >
            <h1 class="sightings-title">Sightings map</h1>
            <p class="sightings-intro">
                The places where I photographed the birds on this blog. Tap a
                pin, or a sighting below, to see it on the map.
            </p>
            ${error
                ? html`<p class="sightings-error">${error}</p>`
                : html`<div
                      class="sightings-map"
                      ref=${mapElement}
                      aria-label="Map of bird sightings"
                  />`}
            <ul class="sightings-list">
                ${sightings.map((sighting, index) => {
                    const bird = getBird(sighting.birdId) ?? birds[0]
                    const post = bird.postId ? articles?.[bird.postId] : null
                    return html`<li
                        key=${index}
                        class="sighting ${selected === index ? 'selected' : ''}"
                    >
                        <h2>${bird.name}</h2>
                        <p class="where">
                            <i
                                class="fa-solid fa-location-dot"
                                aria-hidden="true"
                            />
                            ${' '}${sighting.place}${sighting.date
                                ? ` · ${sighting.date}`
                                : ''}
                        </p>
                        ${sighting.note &&
                        html`<p class="note">${sighting.note}</p>`}
                        <div class="actions">
                            <button
                                class="show-on-map"
                                onClick=${() => focus(index)}
                            >
                                Show on map
                            </button>
                            ${post &&
                            html`<a
                                href=${prefixUriIfNeeded(post.uri)}
                                onClick=${avoidReload}
                                >Read the post →</a
                            >`}
                            <${BirdCall} bird=${bird} />
                        </div>
                    </li>`
                })}
            </ul>
        <//>`
}
