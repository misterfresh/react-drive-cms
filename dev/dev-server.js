let express = require('express')
let path = require('path')
let fs = require('fs')

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

fs.copyFileSync(
    path.join(
        process.cwd(),
        `assets/${
            process.env.NODE_ENV === 'production'
                ? 'build/index_build'
                : 'html/index_dev'
        }.html`
    ),
    path.join(process.cwd(), 'index.html')
)

const app = express()
app.use(require('morgan')('dev'))
app.use(require('./middleware/update-middleware'))
app.use(require('./middleware/transform-middleware'))
app.get('/stream', function(req, res) {
    res.sseSetup()
})
app.get('/conf.js', function(req, res) {
    res.sendFile(path.join(process.cwd(), 'conf.js'))
})

app.use(express.static(process.cwd()))
app.use(function(req, res, next) {
    res.status(404).sendFile(path.join(process.cwd(), '404.html'))
})
app.listen(8000, () => console.log('React drive cms listening on port 8000!'))
