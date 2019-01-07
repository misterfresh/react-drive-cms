let transformFile = require('./transform-file')

function transformMiddleware(req, res, next) {
    if (req.url.startsWith('/src/')) {
        return transformFile(req, res, next)
    } else {
        return next()
    }
}

module.exports = transformMiddleware
