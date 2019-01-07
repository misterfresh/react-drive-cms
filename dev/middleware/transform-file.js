let path = require('path')
let fs = require('fs')
let crypto = require('crypto')
let cache = require('./cache')
let update = require('./update')
let send = require('./send')

function transformFile(req, res, next) {
    let uri = req.url.split('?').shift()
    let file = path.join(process.cwd(), uri)
    let src = file.replace(/\\/gi, '/')

    fs.lstat(file, function(err, stats) {
        if (err) {
            res.status(500).json(err)
        } else {
            let mtime = stats.mtime.getTime()
            let lastModifiedHash = crypto
                .createHash('md5')
                .update(mtime + '-' + src)
                .digest('hex')

            let lastKnownHash = cache.get('hashMap', src)
            if (lastKnownHash && lastKnownHash === lastModifiedHash) {
                send(res, cache.get('cacheMap', lastKnownHash), true)
            } else {
                update(file, lastModifiedHash, function(err, updated) {
                    if (err) {
                        res.status(500).json(err)
                    } else {
                        send(res, updated.file)
                    }
                })
            }
        }
    })
}

module.exports = transformFile
