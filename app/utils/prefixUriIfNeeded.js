const conf = window.appConf

// this is to adapt URL to work on GitHub Pages
export default function prefixUriIfNeeded(uri) {
    const base = window.location.origin
    uri = uri.startsWith(base) ? uri : base + uri
    const root = `/${conf.root}`

    const shouldIncludeRoot = !base.includes('localhost')
    const path = window.location.href.split(base)[1]
    console.log('path', path)
    const includesRoot = path.startsWith(root)
    if (!shouldIncludeRoot || includesRoot) {
        return uri
    } else {
        return base + root + path
    }
}
