import conf from '../conf.js'

export default function resolveAsset(uri){
    const base = `${window.location.protocol}//${
        window.location.hostname
        }:${window.location.port}`

    const root = (conf.root && !window.location.origin.includes(conf.local)) ? ('/' + conf.root) : ''
    const local = window.location.origin.includes(conf.local)  ? '' : ('/' + conf.local)

    return base + root + local + uri
}
