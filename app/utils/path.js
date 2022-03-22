export const getPathParts = function (uri) {
    const uriToSplit = uri ?? window.location.pathname
    return uriToSplit.split('/')
}
