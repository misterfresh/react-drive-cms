const http = require('http')
const url = require('url')
const fs = require('fs')
const path = require('path')
const port = process.argv[2] || 8080

const index = fs.readFileSync(
    path.join(process.cwd(), 'dev', 'index.html'),
    'utf8'
)
const notFound = fs.readFileSync(
    path.join(process.cwd(), 'dev', '404.html'),
    'utf8'
)

http.createServer(function (req, res) {
    console.log(`${req.method} ${req.url}`)

    if (req.url === '/' || req.url.startsWith('/?p=')) {
        res.statusCode = 200
        res.setHeader('Content-type', 'text/html')
        res.end(index)
        return
    }
    // parse URL
    const parsedUrl = url.parse(req.url)
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`
    // based on the URL path, extract the file extension. e.g. .js, .doc, ...
    const ext = path.parse(pathname).ext
    // maps file extention to MIME typere
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js_commonjs-proxy': 'text/javascript',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
        '.pbf': 'application/x-protobuf',
    }

    fs.exists(pathname, function (exist) {
        if (!exist) {
            if (!ext) {
                // if there is no extension, redirect to index with the uri as param
                res.writeHead(404, {
                    'Content-Type': 'text/html',
                    Location: '/?p=' + req.url,
                })
                res.end(notFound)
                return
            } else {
                // if the file is not found, return 404
                res.statusCode = 404
                res.end(`File ${pathname} not found!`)
                return
            }
        }

        // if is a directory search for index file matching the extention
        if (fs.statSync(pathname).isDirectory()) pathname += '/index' + ext

        // read file from file system
        fs.readFile(pathname, function (err, data) {
            if (err) {
                res.statusCode = 500
                res.end(`Error getting the file: ${err}.`)
            } else {
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', map[ext] || 'text/plain')
                res.end(data)
            }
        })
    })
}).listen(parseInt(port))

console.log(`Server listening on port ${port}`)
