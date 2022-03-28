const conf = window.appConf

// this is to adapt URL to work on GitHub Pages
export default function prefixUriIfNeeded(uri) {
    if (!uri) {
        return ''
    }
    const base = window.location.origin
    uri = uri.startsWith(base) ? uri : base + uri
    const root = `/${conf.root}`

    const shouldIncludeRoot = !base.includes('localhost')
    const path = uri.split(base)[1]
    const includesRoot = path.startsWith(root)
    if (!shouldIncludeRoot || includesRoot) {
        return uri
    } else {
        return base + root + path
    }
}
