function send(
    res,
    transpiled,
    fromCache = false,
    contentType = 'application/javascript'
) {
    res.setHeader('Content-type', contentType)
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Accept-Ranges', 'bytes')
    res.setHeader(
        'Cache-Control',
        'private, no-cache, no-store, must-revalidate'
    )
    res.setHeader('Expires', '-1')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.append('X-App-Cache-Hit', fromCache)
    res.status(200).send(transpiled)
}

module.exports = send
