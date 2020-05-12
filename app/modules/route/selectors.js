import { matchPath } from '../../../deps/react-router-dom.js'

export const getLocation = (state) => state.route.location

export const createMatchSelector = (path) => {
    let lastPathname = null
    let lastMatch = null
    return (state) => {
        const { pathname } = getLocation(state)
        if (pathname === lastPathname) {
            return lastMatch
        }
        lastPathname = pathname
        const match = matchPath(pathname, path)
        if (!match || !lastMatch || match.url !== lastMatch.url) {
            lastMatch = match
        }
        return lastMatch
    }
}

export const getQuery = (state) =>
    !!state.route.location.query ? state.route.location.query : {}

export const getSerializedQuery = (state) =>
    state.route.location.search.slice(1)

export const getPath = (state) => state.route.location.pathname

export const getPathParts = (state) =>
    state.route.location.pathname.split('/').filter((part) => !!part)

export const getRoot = (state) => {
    let parts = getPathParts(state)
    let root = 'home'
    if (typeof parts[0] !== 'undefined') {
        root = parts[0]
    }
    return root
}
