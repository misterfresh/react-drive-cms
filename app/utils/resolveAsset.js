const conf = window.appConf

export default function resolveAsset(uri) {
    const base = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`

    const root =
        conf.root
            ? '/' + conf.root
            : ''
    const local = window.location.origin.includes(conf.local)
        ? ''
        : '/' + conf.local

    return base + root + uri
}
