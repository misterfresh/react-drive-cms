let express = require('express')
let path = require('path')
let fs = require('fs')
let projectConf = require('./../conf')
let projectRoot = projectConf.root ? `/${projectConf.root}/` : false
let cachedConf = 'export default ' + JSON.stringify(projectConf)

process.on('unhandledRejection', (reason, promise) => {
    if (reason.stack) {
        console.log(reason.stack)
    } else {
        console.log({ err: reason, promise: promise })
    }
})

const watcher = require('chokidar').watch([path.join(process.cwd(), 'src')])
watcher.on('ready', function() {
    watcher.on('all', function() {
        Object.keys(require.cache).forEach(function(id) {
            if (/[\/\\]src[\/\\]/.test(id)) {
                delete require.cache[id]
            }
        })
    })
})

let index_dev = fs.readFileSync(
    path.join(process.cwd(), 'assets/html/index_dev.html'),
    'utf-8'
)
if (projectRoot) {
    index_dev = index_dev
        .replace(/\/assets\//g, `${projectRoot}assets/`)
        .replace('/src/', `${projectRoot}src/`)
}
fs.writeFileSync(
    path.join(process.cwd(), 'assets/build/index_dev.html'),
    index_dev
)

fs.copyFileSync(
    path.join(
        process.cwd(),
        `assets/build/index_${
            process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
        }.html`
    ),
    path.join(process.cwd(), 'index.html')
)

fs.copyFileSync(
    path.join(
        process.cwd(),
        `assets/html/404_${projectRoot ? 'with_root' : 'no_root'}.html`
    ),
    path.join(process.cwd(), '404.html')
)

const app = express()
app.use(require('morgan')('dev'))
app.use(function(req, res, next) {
    if (projectRoot && req.url.startsWith(projectRoot)) {
        req.url = req.url.slice(projectRoot.length - 1)
    }
    return next()
})
app.use(require('./middleware/update-middleware'))
app.use(require('./middleware/transform-middleware'))
app.get('/stream', function(req, res) {
    res.sseSetup()
})
app.get('/conf.js', function(req, res) {
    res.setHeader('Content-type', 'application/javascript')
    res.status(200).send(cachedConf)
})

app.use(express.static(process.cwd()))
app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(process.cwd(), '404.html'))
})
app.listen(8000, () =>
    console.log(
        `React drive cms listening on url: http://localhost:8000${projectRoot}`
    )
)
