let fs = require('fs')
let path = require('path')
let dependencies = fs
    .readdirSync(path.join(process.cwd(), 'assets/js/vendors'))
    .map(file => file.slice(0, -3))
let plugins = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '.babelrc'), 'utf-8')
).plugins
let moduleResolver = plugins.find(
    plugin =>
        typeof plugin[0] !== 'undefined' && plugin[0] === 'module-resolver'
)
let aliases = moduleResolver[1]['alias']

function resolver({ node: { source } }) {
    if (source !== null) {
        if (dependencies.includes(source.value)) {
            source.value = '/assets/js/vendors/' + source.value
        } else {
            if (
                !source.value.startsWith('/') &&
                !source.value.startsWith('./')
            ) {
                let alias = source.value.split('/')[0]
                if (typeof aliases[alias] !== 'undefined') {
                    source.value =
                        aliases[alias]['slice'](1) +
                        source.value.slice(alias.length)
                } else {
                    source.value = '/src/' + source.value
                }
            }
        }
        if (!source.value.endsWith('.js')) {
            source.value += '.js'
        }
    }
}

function resolveToUrl() {
    return {
        visitor: {
            ImportDeclaration: resolver
        }
    }
}

module.exports = resolveToUrl
