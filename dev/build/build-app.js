let rollup = require('rollup')
let resolve = require('rollup-plugin-node-resolve')
let replace = require('rollup-plugin-replace')
let babel = require('rollup-plugin-babel')
let fs = require('fs')
let path = require('path')
let Terser = require('terser')
let hasha = require('hasha')

let dependencies = {}
fs.readdirSync(path.join(process.cwd(), 'assets/js/vendors')).forEach(file => {
    dependencies[file.slice(0, -3)] = `./assets/js/vendors/${file}`
})
let index_prod = fs.readFileSync(
    path.join(process.cwd(), 'assets/html/index_prod.html'),
    'utf-8'
)

let conf = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '.babelrc'), 'utf-8')
)
let moduleResolverIndex = conf.plugins.findIndex(
    plugin =>
        typeof plugin[0] !== 'undefined' && plugin[0] === 'module-resolver'
)
conf.babelrc = false
conf.exclude = 'node_modules/**'
conf.plugins[moduleResolverIndex][1]['alias'] = {
    ...conf.plugins[moduleResolverIndex][1]['alias'],
    ...dependencies
}

rollup
    .rollup({
        input: path.join(process.cwd(), 'src/app.js'),
        plugins: [
            replace({
                'process.env.NODE_ENV': `"production"`
            }),
            resolve({
                module: true,
                jsnext: true,
                extensions: ['.js'],
                browser: true
            }),
            babel(conf)
        ]
    })
    .then(bundle => {
        bundle
            .generate({
                format: 'iife',
                moduleName: 'ReactDriveCMS'
            })
            .then(result => {
                let { code } = result.output[0]
                let hash = hasha(code, { algorithm: 'sha1' }).slice(0, 16)
                fs.writeFile(
                    path.join(process.cwd(), 'assets/build/index_build.html'),
                    index_prod.replace('<VERSION_HASH>', hash),
                    (err, res) => {
                        if(err){
                            console.log(err)
                        }
                    }
                )
                code = Terser.minify(code).code
                return fs.writeFile(
                    path.join(process.cwd(), `assets/build/app.min.${hash}.js`),
                    code,
                    (err, res) => {
                        if(err){
                            console.log(err)
                        } else {
                            console.log('Build complete.')
                        }
                    }
                )
            })
    })
    .catch(error => console.log(error))
