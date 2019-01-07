let path = require('path')
let zlib = require('zlib')
let babel = require('@babel/core')

let cache = require('./cache')
let resolveToUrl = require('./resolveToUrl')
let conf = JSON.parse(
    require('fs').readFileSync(path.join(process.cwd(), '.babelrc'), 'utf-8')
)
conf.babelrc = false
conf.plugins.pop()
conf.plugins.push([resolveToUrl])

function update(file, hash, cb) {
    babel.transformFile(file, conf, function(err, transpiled) {
        if (err) {
            cb(err)
        } else {
            zlib.gzip(transpiled.code, function(err, gzipped) {
                if (err) {
                    cb(err)
                } else {
                    let path = file.replace(/\\/gi, '/')

                    cache.remove('cacheMap', cache.get('hashMap', path))
                    cache.set('hashMap', path, hash)
                    cache.set('cacheMap', hash, gzipped)

                    let link = '/src/' + path.split('/src/')[1]
                    let cached = {
                        file: gzipped,
                        type: 'application/javascript'
                    }
                    cache.set('links', link, cached)

                    cb(null, cached)
                }
            })
        }
    })
}

module.exports = update
