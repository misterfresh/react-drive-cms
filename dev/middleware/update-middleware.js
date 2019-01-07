let chokidar = require('chokidar')
let path = require('path')
let fs = require('fs')
let crypto = require('crypto')
let serverStart = Date.now()
let update = require('./update')
let debounce = require('lodash.debounce')
let cache = require('./cache')

let refresh = debounce(function(res) {
    Object.keys(cache.getAll('stale')).forEach(file => {
        let src = file.replace(/\\/gi, '/')
        let fileUri = file.split(process.cwd())[1].replace(/\\/gi, '/')
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
                if (!lastKnownHash && lastKnownHash === lastModifiedHash) {
                    res.write('data: ' + fileUri + '\n\n')
                    cache.remove('stale', file)
                } else {
                    update(file, lastModifiedHash, function(err, updated) {
                        if (err) {
                            res.status(500).json(err)
                        } else {
                            res.write('data: ' + fileUri + '\n\n')
                            cache.remove('stale', file)
                        }
                    })
                }
            }
        })
    })
})

function updater(req, res, next) {
    if (typeof res.sseSetup !== 'undefined') {
        return next()
    }

    res.sseSetup = function() {
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        })
        serverStart = Date.now()
        chokidar
            .watch(path.join(process.cwd(), 'src'), {
                ignored: /(^|[\/\\])\../
            })
            .on('all', (event, filePath) => {
                if (
                    Date.now() - serverStart > 10000 &&
                    !(
                        filePath.endsWith('___jb_tmp___') ||
                        filePath.endsWith('___jb_old___')
                    )
                ) {
                    if (event === 'change' || event === 'add') {
                        console.log(event, filePath)
                        cache.set('stale', filePath)
                        refresh(res)
                    } else if (event === 'unlink') {
                        console.log('unlink', filePath)
                        cache.remove('stale', filePath)
                        let link =
                            '/src/' +
                            filePath.replace(/\\/gi, '/').split('/src/')[1]
                        cache.remove('links', link)
                    }
                }
            })
    }

    return next()
}

module.exports = updater
