export const getPathParts = function (uri) {
    const uriToSplit = uri ?? window.location.pathname
    return uriToSplit.split('/')
}

export const getPageName = function (uri) {
    const pathParts = getPathParts(uri)
    return window.location.origin.includes('localhost')
        ? pathParts[1]
        : pathParts[2]
}

export const getActiveItemId = function (uri) {
    const pathParts = getPathParts(uri)
    return window.location.origin.includes('localhost')
        ? pathParts[2]
        : pathParts[3]
}
