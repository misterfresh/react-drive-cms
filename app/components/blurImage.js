import { html, useEffect, useRef, useState } from '../lib/htm-preact.js'

// An <img> that shows a tiny blurred preview while it loads, then fades in.
// preview: a small data: URI (see scripts/make_previews.py); optional. Without
// one, the photo still fades in over a soft background.
// fill: true makes it fill its parent (for fixed-size frames like cards).
// The styles live in index.html (.blur-image), so they're shared by every image.
export const BlurImage = ({ src, preview, fill = false, ...imgProps }) => {
    const image = useRef(null)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        // Already in the browser cache: show it straight away, no fade.
        const element = image.current
        setLoaded(Boolean(element?.complete && element.naturalWidth))
    }, [src])

    return html`<span
        class="blur-image ${fill ? 'blur-image-fill' : ''} ${loaded
            ? 'is-loaded'
            : ''}"
        style=${preview ? { '--preview': `url("${preview}")` } : null}
    >
        <img
            ref=${image}
            src=${src}
            onLoad=${() => setLoaded(true)}
            onError=${() => setLoaded(true)}
            ...${imgProps}
        />
    </span>`
}
