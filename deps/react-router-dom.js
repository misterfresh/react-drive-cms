var process = {
    env: {
        NODE_ENV: 'production',
    },
}
var __DEV__ = false
import React, { Component, html } from './react.js'
var React$1 = React
import PropTypes from './prop-types.js'
import {
    createMemoryHistory,
    createLocation,
    locationsAreEqual,
    createPath,
    createBrowserHistory,
    createHashHistory,
} from './history.js'

const isProduction = process.env.NODE_ENV === 'production'

function warning(condition, message) {
    // don't do anything in production
    // wrapping in production check for better dead code elimination
    if (!isProduction) {
        // condition passed: do not log
        if (condition) {
            return
        }

        // Condition not passed
        const text = `Warning: ${message}`

        // check console for IE9 support which provides console
        // only with open devtools
        if (typeof console !== 'undefined') {
            console.warn(text)
        }

        // Throwing an error and catching it immediately
        // to improve debugging
        // A consumer can use 'pause on caught exceptions'
        // https://github.com/facebook/react/issues/4216
        try {
            throw Error(text)
        } catch (x) {}
    }
}

function makeEmptyFunction(arg) {
    return function () {
        return arg
    }
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
const emptyFunction = function () {}

emptyFunction.thatReturns = makeEmptyFunction
emptyFunction.thatReturnsFalse = makeEmptyFunction(false)
emptyFunction.thatReturnsTrue = makeEmptyFunction(true)
emptyFunction.thatReturnsNull = makeEmptyFunction(null)
emptyFunction.thatReturnsThis = function () {
    return this
}
emptyFunction.thatReturnsArgument = function (arg) {
    return arg
}
/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

function printWarning(format, ...args) {
    var argIndex = 0
    var message = 'Warning: ' + format.replace(/%s/g, () => args[argIndex++])
    if (typeof console !== 'undefined') {
        console.error(message)
    }
    try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message)
    } catch (x) {}
}

var warning$1 = __DEV__
    ? function (condition, format, ...args) {
          if (format === undefined) {
              throw new Error(
                  '`warning(condition, format, ...args)` requires a warning ' +
                      'message argument'
              )
          }
          if (!condition) {
              printWarning(format, ...args)
          }
      }
    : emptyFunction

var gudkey = '__global_unique_id__'
function gud() {
    return (global[gudkey] = (global[gudkey] || 0) + 1)
}
const MAX_SIGNED_31_BIT_INT = 1073741823

// Inlined Object.is polyfill.
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function objectIs(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y
    } else {
        return x !== x && y !== y
    }
}

function createEventEmitter(value) {
    let handlers = []
    return {
        on(handler) {
            handlers.push(handler)
        },

        off(handler) {
            handlers = handlers.filter((h) => h !== handler)
        },

        get() {
            return value
        },

        set(newValue, changedBits) {
            value = newValue
            handlers.forEach((handler) => handler(value, changedBits))
        },
    }
}

function onlyChild(children) {
    return Array.isArray(children) ? children[0] : children
}

function createReactContext(defaultValue, calculateChangedBits) {
    const contextProp = '__create-react-context-' + gud() + '__'

    class Provider extends Component {
        constructor(props) {
            super(props)
            this.emitter = createEventEmitter(props.value)
        }

        getChildContext() {
            return {
                [contextProp]: this.emitter,
            }
        }

        componentWillReceiveProps(nextProps) {
            if (this.props.value !== nextProps.value) {
                let oldValue = this.props.value
                let newValue = nextProps.value
                let changedBits

                if (objectIs(oldValue, newValue)) {
                    changedBits = 0 // No change
                } else {
                    changedBits =
                        typeof calculateChangedBits === 'function'
                            ? calculateChangedBits(oldValue, newValue)
                            : MAX_SIGNED_31_BIT_INT
                    if (process.env.NODE_ENV !== 'production') {
                        warning$1(
                            (changedBits & MAX_SIGNED_31_BIT_INT) ===
                                changedBits,
                            'calculateChangedBits: Expected the return value to be a ' +
                                '31-bit integer. Instead received: %s',
                            changedBits
                        )
                    }

                    changedBits |= 0

                    if (changedBits !== 0) {
                        this.emitter.set(nextProps.value, changedBits)
                    }
                }
            }
        }

        render() {
            return this.props.children
        }
    }

    Provider.childContextTypes = {
        [contextProp]: PropTypes.object.isRequired,
    }

    class Consumer extends Component {
        constructor(props) {
            super(props)
            this.observedBits = undefined
            this.getValue = this.getValue.bind(this)
            this.onUpdate = this.onUpdate.bind(this)
            this.state = {
                value: this.getValue(),
            }
        }

        componentWillReceiveProps(nextProps) {
            let { observedBits } = nextProps
            this.observedBits =
                observedBits === undefined || observedBits === null
                    ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
                    : observedBits
        }

        componentDidMount() {
            if (this.context[contextProp]) {
                this.context[contextProp].on(this.onUpdate)
            }
            let { observedBits } = this.props
            this.observedBits =
                observedBits === undefined || observedBits === null
                    ? MAX_SIGNED_31_BIT_INT // Subscribe to all changes by default
                    : observedBits
        }

        componentWillUnmount() {
            if (this.context[contextProp]) {
                this.context[contextProp].off(this.onUpdate)
            }
        }

        getValue() {
            if (this.context[contextProp]) {
                return this.context[contextProp].get()
            } else {
                return defaultValue
            }
        }

        onUpdate(newValue, changedBits) {
            const observedBits = this.observedBits | 0
            if ((observedBits & changedBits) !== 0) {
                this.setState({ value: this.getValue() })
            }
        }

        render() {
            return onlyChild(this.props.children)(this.state.value)
        }
    }
    Consumer.contextTypes = {
        [contextProp]: PropTypes.object,
    }
    return {
        Provider,
        Consumer,
    }
}

var createContext = React$1.createContext || createReactContext

// TODO: Replace with React.createContext once we can assume React 16+

const createNamedContext = (name) => {
    const context = createContext()
    context.Provider.displayName = `${name}.Provider`
    context.Consumer.displayName = `${name}.Consumer`
    return context
}

const context = /*#__PURE__*/ createNamedContext('Router')

/**
 * The public API for putting history on context.
 */
class Router extends Component {
    static computeRootMatch(pathname) {
        return { path: '/', url: '/', params: {}, isExact: pathname === '/' }
    }

    constructor(props) {
        super(props)

        this.state = {
            location: props.history.location,
        }

        // This is a bit of a hack. We have to start listening for location
        // changes here in the constructor in case there are any <Redirect>s
        // on the initial render. If there are, they will replace/push when
        // they mount and since cDM fires in children before parents, we may
        // get a new location before the <Router> is mounted.
        this._isMounted = false
        this._pendingLocation = null

        if (!props.staticContext) {
            this.unlisten = props.history.listen((location) => {
                if (this._isMounted) {
                    this.setState({ location })
                } else {
                    this._pendingLocation = location
                }
            })
        }
    }

    componentDidMount() {
        this._isMounted = true

        if (this._pendingLocation) {
            this.setState({ location: this._pendingLocation })
        }
    }

    componentWillUnmount() {
        if (this.unlisten) this.unlisten()
    }

    render() {
        return html` <${context.Provider}
            children=${this.props.children || null}
            value=${{
                history: this.props.history,
                location: this.state.location,
                match: Router.computeRootMatch(this.state.location.pathname),
                staticContext: this.props.staticContext,
            }}
        />`
    }
}

if (__DEV__) {
    Router.propTypes = {
        children: PropTypes.node,
        history: PropTypes.object.isRequired,
        staticContext: PropTypes.object,
    }

    Router.prototype.componentDidUpdate = function (prevProps) {
        warning(
            prevProps.history === this.props.history,
            'You cannot change <Router history>'
        )
    }
}

/**
 * The public API for a <Router> that stores location in memory.
 */
class MemoryRouter extends Component {
    constructor(props) {
        super(props)
        this.history = createMemoryHistory(props)
    }

    render() {
        return html`<${Router}
            history=${this.history}
            children=${this.props.children}
        />`
    }
}

if (__DEV__) {
    MemoryRouter.propTypes = {
        initialEntries: PropTypes.array,
        initialIndex: PropTypes.number,
        getUserConfirmation: PropTypes.func,
        keyLength: PropTypes.number,
        children: PropTypes.node,
    }

    MemoryRouter.prototype.componentDidMount = function () {
        warning(
            !this.props.history,
            '<MemoryRouter> ignores the history prop. To use a custom history, ' +
                'use `import { Router }` instead of `import { MemoryRouter as Router }`.'
        )
    }
}

const isProduction$1 = process.env.NODE_ENV === 'production'
const prefix = 'Invariant failed'

// Throw an error if the condition fails
// Strip out error messages for production
// > Not providing an inline default argument for message as the result is smaller
function invariant(condition, message) {
    if (condition) {
        return
    }
    // Condition not passed

    if (isProduction$1) {
        // In production we strip the message but still throw
        throw new Error(prefix)
    } else {
        // When not in production we allow the message to pass through
        // *This block will be removed in production builds*
        throw new Error(`${prefix}: ${message || ''}`)
    }
}

class Lifecycle extends Component {
    componentDidMount() {
        if (this.props.onMount) this.props.onMount.call(this, this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.onUpdate) this.props.onUpdate.call(this, this, prevProps)
    }

    componentWillUnmount() {
        if (this.props.onUnmount) this.props.onUnmount.call(this, this)
    }

    render() {
        return null
    }
}

/**
 * The public API for prompting the user before navigating away from a screen.
 */
function Prompt({ message, when = true }) {
    return html` <${context.Consumer}>
        ${(context) => {
            invariant(context, 'You should not use <Prompt> outside a <Router>')

            if (!when || context.staticContext) return null

            const method = context.history.block

            return html`
                <${Lifecycle}
                    onMount=${(self) => {
                        self.release = method(message)
                    }}
                    onUpdate=${(self, prevProps) => {
                        if (prevProps.message !== message) {
                            self.release()
                            self.release = method(message)
                        }
                    }}
                    onUnmount=${(self) => {
                        self.release()
                    }}
                    message=${message}
                />
            `
        }}
    <//>`
}

if (__DEV__) {
    const messageType = PropTypes.oneOfType([PropTypes.func, PropTypes.string])

    Prompt.propTypes = {
        when: PropTypes.bool,
        message: messageType.isRequired,
    }
}

/**
 * Default configs.
 */
var DEFAULT_DELIMITER = '/'

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp(
    [
        // Match escaped characters that would otherwise appear in future matches.
        // This allows the user to escape special characters that won't transform.
        '(\\\\.)',
        // Match Express-style parameters and un-named parameters with a prefix
        // and optional suffixes. Matches appear as:
        //
        // ":test(\\d+)?" => ["test", "\d+", undefined, "?"]
        // "(\\d+)"  => [undefined, undefined, "\d+", undefined]
        '(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?',
    ].join('|'),
    'g'
)

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse(str, options) {
    var tokens = []
    var key = 0
    var index = 0
    var path = ''
    var defaultDelimiter = (options && options.delimiter) || DEFAULT_DELIMITER
    var whitelist = (options && options.whitelist) || undefined
    var pathEscaped = false
    var res

    while ((res = PATH_REGEXP.exec(str)) !== null) {
        var m = res[0]
        var escaped = res[1]
        var offset = res.index
        path += str.slice(index, offset)
        index = offset + m.length

        // Ignore already escaped sequences.
        if (escaped) {
            path += escaped[1]
            pathEscaped = true
            continue
        }

        var prev = ''
        var name = res[2]
        var capture = res[3]
        var group = res[4]
        var modifier = res[5]

        if (!pathEscaped && path.length) {
            var k = path.length - 1
            var c = path[k]
            var matches = whitelist ? whitelist.indexOf(c) > -1 : true

            if (matches) {
                prev = c
                path = path.slice(0, k)
            }
        }

        // Push the current path onto the tokens.
        if (path) {
            tokens.push(path)
            path = ''
            pathEscaped = false
        }

        var repeat = modifier === '+' || modifier === '*'
        var optional = modifier === '?' || modifier === '*'
        var pattern = capture || group
        var delimiter = prev || defaultDelimiter

        tokens.push({
            name: name || key++,
            prefix: prev,
            delimiter: delimiter,
            optional: optional,
            repeat: repeat,
            pattern: pattern
                ? escapeGroup(pattern)
                : '[^' +
                  escapeString(
                      delimiter === defaultDelimiter
                          ? delimiter
                          : delimiter + defaultDelimiter
                  ) +
                  ']+?',
        })
    }

    // Push any remaining characters.
    if (path || index < str.length) {
        tokens.push(path + str.substr(index))
    }

    return tokens
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString(str) {
    return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup(group) {
    return group.replace(/([=!:$/()])/g, '\\$1')
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags(options) {
    return options && options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {Array=}  keys
 * @return {!RegExp}
 */
function regexpToRegexp(path, keys) {
    if (!keys) return path

    // Use a negative lookahead to match only capturing groups.
    var groups = path.source.match(/\((?!\?)/g)

    if (groups) {
        for (var i = 0; i < groups.length; i++) {
            keys.push({
                name: i,
                prefix: null,
                delimiter: null,
                optional: false,
                repeat: false,
                pattern: null,
            })
        }
    }

    return path
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function arrayToRegexp(path, keys, options) {
    var parts = []

    for (var i = 0; i < path.length; i++) {
        parts.push(pathToRegexp(path[i], keys, options).source)
    }

    return new RegExp('(?:' + parts.join('|') + ')', flags(options))
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function stringToRegexp(path, keys, options) {
    return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}  tokens
 * @param  {Array=}  keys
 * @param  {Object=} options
 * @return {!RegExp}
 */
function tokensToRegExp(tokens, keys, options) {
    options = options || {}

    var strict = options.strict
    var start = options.start !== false
    var end = options.end !== false
    var delimiter = options.delimiter || DEFAULT_DELIMITER
    var endsWith = []
        .concat(options.endsWith || [])
        .map(escapeString)
        .concat('$')
        .join('|')
    var route = start ? '^' : ''

    // Iterate over the tokens and create our regexp string.
    for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i]

        if (typeof token === 'string') {
            route += escapeString(token)
        } else {
            var capture = token.repeat
                ? '(?:' +
                  token.pattern +
                  ')(?:' +
                  escapeString(token.delimiter) +
                  '(?:' +
                  token.pattern +
                  '))*'
                : token.pattern

            if (keys) keys.push(token)

            if (token.optional) {
                if (!token.prefix) {
                    route += '(' + capture + ')?'
                } else {
                    route +=
                        '(?:' +
                        escapeString(token.prefix) +
                        '(' +
                        capture +
                        '))?'
                }
            } else {
                route += escapeString(token.prefix) + '(' + capture + ')'
            }
        }
    }

    if (end) {
        if (!strict) route += '(?:' + escapeString(delimiter) + ')?'

        route += endsWith === '$' ? '$' : '(?=' + endsWith + ')'
    } else {
        var endToken = tokens[tokens.length - 1]
        var isEndDelimited =
            typeof endToken === 'string'
                ? endToken[endToken.length - 1] === delimiter
                : endToken === undefined

        if (!strict)
            route += '(?:' + escapeString(delimiter) + '(?=' + endsWith + '))?'
        if (!isEndDelimited)
            route += '(?=' + escapeString(delimiter) + '|' + endsWith + ')'
    }

    return new RegExp(route, flags(options))
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {Array=}                keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp(path, keys, options) {
    if (path instanceof RegExp) {
        return regexpToRegexp(path, keys)
    }

    if (Array.isArray(path)) {
        return arrayToRegexp(/** @type {!Array} */ (path), keys, options)
    }

    return stringToRegexp(/** @type {string} */ (path), keys, options)
}

const cache = {}
const cacheLimit = 10000
let cacheCount = 0

function compilePath(path) {
    if (cache[path]) return cache[path]

    const generator = pathToRegexp.compile(path)

    if (cacheCount < cacheLimit) {
        cache[path] = generator
        cacheCount++
    }

    return generator
}

/**
 * Public API for generating a URL pathname from a path and parameters.
 */
function generatePath(path = '/', params = {}) {
    return path === '/' ? path : compilePath(path)(params, { pretty: true })
}

/**
 * The public API for navigating programmatically with a component.
 */
function Redirect({ computedMatch, to, push = false }) {
    return html` <${context.Consumer}>
        ${(context) => {
            invariant(
                context,
                'You should not use <Redirect> outside a <Router>'
            )

            const { history, staticContext } = context

            const method = push ? history.push : history.replace
            const location = createLocation(
                computedMatch
                    ? typeof to === 'string'
                        ? generatePath(to, computedMatch.params)
                        : {
                              ...to,
                              pathname: generatePath(
                                  to.pathname,
                                  computedMatch.params
                              ),
                          }
                    : to
            )

            // When rendering in a static context,
            // set the new location immediately.
            if (staticContext) {
                method(location)
                return null
            }

            return html` <${Lifecycle}
                onMount=${() => {
                    method(location)
                }}
                onUpdate=${(self, prevProps) => {
                    if (!locationsAreEqual(prevProps.to, location)) {
                        method(location)
                    }
                }}
                to=${to}
            />`
        }}
    <//>`
}

if (__DEV__) {
    Redirect.propTypes = {
        push: PropTypes.bool,
        from: PropTypes.string,
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
            .isRequired,
    }
}

const hasSymbol = typeof Symbol === 'function' && Symbol.for
const REACT_FRAGMENT_TYPE = hasSymbol ? Symbol.for('react.fragment') : 0xeacb
const REACT_STRICT_MODE_TYPE = hasSymbol
    ? Symbol.for('react.strict_mode')
    : 0xeacc
const REACT_PROFILER_TYPE = hasSymbol ? Symbol.for('react.profiler') : 0xead2
const REACT_PROVIDER_TYPE = hasSymbol ? Symbol.for('react.provider') : 0xeacd
const REACT_CONTEXT_TYPE = hasSymbol ? Symbol.for('react.context') : 0xeace
const REACT_CONCURRENT_MODE_TYPE = hasSymbol
    ? Symbol.for('react.concurrent_mode')
    : 0xeacf
const REACT_FORWARD_REF_TYPE = hasSymbol
    ? Symbol.for('react.forward_ref')
    : 0xead0
const REACT_SUSPENSE_TYPE = hasSymbol ? Symbol.for('react.suspense') : 0xead1
const REACT_MEMO_TYPE = hasSymbol ? Symbol.for('react.memo') : 0xead3
const REACT_LAZY_TYPE = hasSymbol ? Symbol.for('react.lazy') : 0xead4

function isValidElementType(type) {
    return (
        typeof type === 'string' ||
        typeof type === 'function' ||
        // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
        type === REACT_FRAGMENT_TYPE ||
        type === REACT_CONCURRENT_MODE_TYPE ||
        type === REACT_PROFILER_TYPE ||
        type === REACT_STRICT_MODE_TYPE ||
        type === REACT_SUSPENSE_TYPE ||
        (typeof type === 'object' &&
            type !== null &&
            (type.$$typeof === REACT_LAZY_TYPE ||
                type.$$typeof === REACT_MEMO_TYPE ||
                type.$$typeof === REACT_PROVIDER_TYPE ||
                type.$$typeof === REACT_CONTEXT_TYPE ||
                type.$$typeof === REACT_FORWARD_REF_TYPE))
    )
}

const cache$1 = {}
const cacheLimit$1 = 10000
let cacheCount$1 = 0

function compilePath$1(path, options) {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`
    const pathCache = cache$1[cacheKey] || (cache$1[cacheKey] = {})

    if (pathCache[path]) return pathCache[path]

    const keys = []
    const regexp = pathToRegexp(path, keys, options)
    const result = { regexp, keys }

    if (cacheCount$1 < cacheLimit$1) {
        pathCache[path] = result
        cacheCount$1++
    }

    return result
}

/**
 * Public API for matching a URL pathname to a path.
 */
function matchPath(pathname, options = {}) {
    if (typeof options === 'string') options = { path: options }

    const { path, exact = false, strict = false, sensitive = false } = options

    const paths = [].concat(path)

    return paths.reduce((matched, path) => {
        if (matched) return matched
        const { regexp, keys } = compilePath$1(path, {
            end: exact,
            strict,
            sensitive,
        })
        const match = regexp.exec(pathname)

        if (!match) return null

        const [url, ...values] = match
        const isExact = pathname === url

        if (exact && !isExact) return null

        return {
            path, // the path used to match
            url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
            isExact, // whether or not we matched exactly
            params: keys.reduce((memo, key, index) => {
                memo[key.name] = values[index]
                return memo
            }, {}),
        }
    }, null)
}

function isEmptyChildren(children) {
    return React.Children.count(children) === 0
}

/**
 * The public API for matching a single path and rendering.
 */
class Route extends Component {
    render() {
        return html` <${context.Consumer}>
            ${(context$1) => {
                invariant(
                    context$1,
                    'You should not use <Route> outside a <Router>'
                )

                const location = this.props.location || context$1.location
                const match = this.props.computedMatch
                    ? this.props.computedMatch // <Switch> already computed the match for us
                    : this.props.path
                    ? matchPath(location.pathname, this.props)
                    : context$1.match

                const props = { ...context$1, location, match }

                let { children, component, render } = this.props

                // Preact uses an empty array as children by
                // default, so use null if that's the case.
                if (Array.isArray(children) && children.length === 0) {
                    children = null
                }

                if (typeof children === 'function') {
                    children = children(props)

                    if (children === undefined) {
                        if (__DEV__) {
                            const { path } = this.props

                            warning(
                                false,
                                'You returned `undefined` from the `children` function of ' +
                                    `<Route${
                                        path ? ` path="${path}"` : ''
                                    }>, but you ` +
                                    'should have returned a React element or `null`'
                            )
                        }

                        children = null
                    }
                }

                return html` <${context.Provider} value=${props}>
                    ${children && !isEmptyChildren(children)
                        ? children
                        : props.match
                        ? component
                            ? React.createElement(component, props)
                            : render
                            ? render(props)
                            : null
                        : null}
                <//>`
            }}
        <//>`
    }
}

if (__DEV__) {
    Route.propTypes = {
        children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
        component: (props, propName) => {
            if (props[propName] && !isValidElementType(props[propName])) {
                return new Error(
                    `Invalid prop 'component' supplied to 'Route': the prop is not a valid React component`
                )
            }
        },
        exact: PropTypes.bool,
        location: PropTypes.object,
        path: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        render: PropTypes.func,
        sensitive: PropTypes.bool,
        strict: PropTypes.bool,
    }

    Route.prototype.componentDidMount = function () {
        warning(
            !(
                this.props.children &&
                !isEmptyChildren(this.props.children) &&
                this.props.component
            ),
            'You should not use <Route component> and <Route children> in the same route; <Route component> will be ignored'
        )

        warning(
            !(
                this.props.children &&
                !isEmptyChildren(this.props.children) &&
                this.props.render
            ),
            'You should not use <Route render> and <Route children> in the same route; <Route render> will be ignored'
        )

        warning(
            !(this.props.component && this.props.render),
            'You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored'
        )
    }

    Route.prototype.componentDidUpdate = function (prevProps) {
        warning(
            !(this.props.location && !prevProps.location),
            '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
        )

        warning(
            !(!this.props.location && prevProps.location),
            '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
        )
    }
}

function addLeadingSlash(path) {
    return path.charAt(0) === '/' ? path : '/' + path
}

function addBasename(basename, location) {
    if (!basename) return location

    return {
        ...location,
        pathname: addLeadingSlash(basename) + location.pathname,
    }
}

function stripBasename(basename, location) {
    if (!basename) return location

    const base = addLeadingSlash(basename)

    if (location.pathname.indexOf(base) !== 0) return location

    return {
        ...location,
        pathname: location.pathname.substr(base.length),
    }
}

function createURL(location) {
    return typeof location === 'string' ? location : createPath(location)
}

function staticHandler(methodName) {
    return () => {
        invariant(false, 'You cannot %s with <StaticRouter>', methodName)
    }
}

function noop() {}

/**
 * The public top-level API for a "static" <Router>, so-called because it
 * can't actually change the current location. Instead, it just records
 * location changes in a context object. Useful mainly in testing and
 * server-rendering scenarios.
 */
class StaticRouter extends Component {
    constructor(props) {
        super(props)
        this.navigateTo = this.navigateTo.bind(this)
        this.handlePush = this.handlePush.bind(this)
        this.handleReplace = this.handleReplace.bind(this)
        this.handleListen = this.handleListen.bind(this)
        this.handleBlock = this.handleBlock.bind(this)
    }
    navigateTo(location, action) {
        const { basename = '', context } = this.props
        context.action = action
        context.location = addBasename(basename, createLocation(location))
        context.url = createURL(context.location)
    }

    handlePush(location) {
        return this.navigateTo(location, 'PUSH')
    }
    handleReplace(location) {
        return this.navigateTo(location, 'REPLACE')
    }
    handleListen() {
        return noop
    }
    handleBlock() {
        return noop
    }

    render() {
        const {
            basename = '',
            context = {},
            location = '/',
            ...rest
        } = this.props

        const history = {
            createHref: (path) => addLeadingSlash(basename + createURL(path)),
            action: 'POP',
            location: stripBasename(basename, createLocation(location)),
            push: this.handlePush,
            replace: this.handleReplace,
            go: staticHandler('go'),
            goBack: staticHandler('goBack'),
            goForward: staticHandler('goForward'),
            listen: this.handleListen,
            block: this.handleBlock,
        }

        return html`<${Router}
            ...${rest}
            history=${history}
            staticContext=${context}
        />`
    }
}

if (__DEV__) {
    StaticRouter.propTypes = {
        basename: PropTypes.string,
        context: PropTypes.object,
        location: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    }

    StaticRouter.prototype.componentDidMount = function () {
        warning(
            !this.props.history,
            '<StaticRouter> ignores the history prop. To use a custom history, ' +
                'use `import { Router }` instead of `import { StaticRouter as Router }`.'
        )
    }
}

/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends Component {
    render() {
        return html` <${context.Consumer}>
            ${(context) => {
                invariant(
                    context,
                    'You should not use <Switch> outside a <Router>'
                )

                const location = this.props.location || context.location

                let element, match

                // We use React.Children.forEach instead of React.Children.toArray().find()
                // here because toArray adds keys to all child elements and we do not want
                // to trigger an unmount/remount for two <Route>s that render the same
                // component at different URLs.
                React.Children.forEach(this.props.children, (child) => {
                    if (match == null && React.isValidElement(child)) {
                        element = child

                        const path = child.props.path || child.props.from

                        match = path
                            ? matchPath(location.pathname, {
                                  ...child.props,
                                  path,
                              })
                            : context.match
                    }
                })

                return match
                    ? React.cloneElement(element, {
                          location,
                          computedMatch: match,
                      })
                    : null
            }}
        <//>`
    }
}

if (__DEV__) {
    Switch.propTypes = {
        children: PropTypes.node,
        location: PropTypes.object,
    }

    Switch.prototype.componentDidUpdate = function (prevProps) {
        warning(
            !(this.props.location && !prevProps.location),
            '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
        )

        warning(
            !(!this.props.location && prevProps.location),
            '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
        )
    }
}

const ReactIs = './react-is.js'
const REACT_STATICS = {
    childContextTypes: true,
    contextType: true,
    contextTypes: true,
    defaultProps: true,
    displayName: true,
    getDefaultProps: true,
    getDerivedStateFromError: true,
    getDerivedStateFromProps: true,
    mixins: true,
    propTypes: true,
    type: true,
}

const KNOWN_STATICS = {
    name: true,
    length: true,
    prototype: true,
    caller: true,
    callee: true,
    arguments: true,
    arity: true,
}

const FORWARD_REF_STATICS = {
    $$typeof: true,
    render: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
}

const MEMO_STATICS = {
    $$typeof: true,
    compare: true,
    defaultProps: true,
    displayName: true,
    propTypes: true,
    type: true,
}

const TYPE_STATICS = {}
TYPE_STATICS[ReactIs.ForwardRef] = FORWARD_REF_STATICS

function getStatics(component) {
    if (ReactIs.isMemo(component)) {
        return MEMO_STATICS
    }
    return TYPE_STATICS[component['$$typeof']] || REACT_STATICS
}

const defineProperty = Object.defineProperty
const getOwnPropertyNames = Object.getOwnPropertyNames
const getOwnPropertySymbols = Object.getOwnPropertySymbols
const getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor
const getPrototypeOf = Object.getPrototypeOf
const objectPrototype = Object.prototype

function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
    if (typeof sourceComponent !== 'string') {
        // don't hoist over string (html) components

        if (objectPrototype) {
            const inheritedComponent = getPrototypeOf(sourceComponent)
            if (inheritedComponent && inheritedComponent !== objectPrototype) {
                hoistNonReactStatics(
                    targetComponent,
                    inheritedComponent,
                    blacklist
                )
            }
        }

        let keys = getOwnPropertyNames(sourceComponent)

        if (getOwnPropertySymbols) {
            keys = keys.concat(getOwnPropertySymbols(sourceComponent))
        }

        const targetStatics = getStatics(targetComponent)
        const sourceStatics = getStatics(sourceComponent)

        for (let i = 0; i < keys.length; ++i) {
            const key = keys[i]
            if (
                !KNOWN_STATICS[key] &&
                !(blacklist && blacklist[key]) &&
                !(sourceStatics && sourceStatics[key]) &&
                !(targetStatics && targetStatics[key])
            ) {
                const descriptor = getOwnPropertyDescriptor(
                    sourceComponent,
                    key
                )
                try {
                    // Avoid failures from read-only properties
                    defineProperty(targetComponent, key, descriptor)
                } catch (e) {}
            }
        }

        return targetComponent
    }

    return targetComponent
}

/**
 * A public higher-order component to access the imperative API
 */
function withRouter(Component) {
    const C = (props) => {
        const { wrappedComponentRef, ...remainingProps } = props
        return html` <${Route}
            children=${(routeComponentProps) => html` <${Component}
                ...${remainingProps}
                ...${routeComponentProps}
                ref=${wrappedComponentRef}
            />`}
        />`
    }

    C.displayName = `withRouter(${Component.displayName || Component.name})`
    C.WrappedComponent = Component

    if (__DEV__) {
        C.propTypes = {
            wrappedComponentRef: PropTypes.func,
        }
    }

    return hoistNonReactStatics(C, Component)
}

if (__DEV__) {
    if (typeof window !== 'undefined') {
        const global = window
        const key = '__react_router_build__'
        const buildNames = { cjs: 'CommonJS', esm: 'ES modules', umd: 'UMD' }

        if (global[key] && global[key] !== process.env.BUILD_FORMAT) {
            const initialBuildName = buildNames[global[key]]
            const secondaryBuildName = buildNames[process.env.BUILD_FORMAT]

            // TODO: Add link to article that explains in detail how to avoid
            // loading 2 different builds.
            throw new Error(
                `You are loading the ${secondaryBuildName} build of React Router ` +
                    `on a page that is already running the ${initialBuildName} ` +
                    `build, so things won't work right.`
            )
        }

        global[key] = process.env.BUILD_FORMAT
    }
}

/**
 * The public API for a <Router> that uses HTML5 history.
 */
class BrowserRouter extends Component {
    constructor(props) {
        super(props)
        this.history = createBrowserHistory(props)
    }

    render() {
        return html`<${Router}
            history=${this.history}
            children=${this.props.children}
        />`
    }
}

if (__DEV__) {
    BrowserRouter.propTypes = {
        basename: PropTypes.string,
        children: PropTypes.node,
        forceRefresh: PropTypes.bool,
        getUserConfirmation: PropTypes.func,
        keyLength: PropTypes.number,
    }

    BrowserRouter.prototype.componentDidMount = function () {
        warning(
            !this.props.history,
            '<BrowserRouter> ignores the history prop. To use a custom history, ' +
                'use `import { Router }` instead of `import { BrowserRouter as Router }`.'
        )
    }
}

/**
 * The public API for a <Router> that uses window.location.hash.
 */
class HashRouter extends Component {
    constructor(props) {
        super(props)
        this.history = createHashHistory(props)
    }

    render() {
        return html`<${Router}
            history=${this.history}
            children=${this.props.children}
        />`
    }
}

if (__DEV__) {
    HashRouter.propTypes = {
        basename: PropTypes.string,
        children: PropTypes.node,
        getUserConfirmation: PropTypes.func,
        hashType: PropTypes.oneOf(['hashbang', 'noslash', 'slash']),
    }

    HashRouter.prototype.componentDidMount = function () {
        warning(
            !this.props.history,
            '<HashRouter> ignores the history prop. To use a custom history, ' +
                'use `import { Router }` instead of `import { HashRouter as Router }`.'
        )
    }
}

function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
}

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends Component {
    handleClick(event, history) {
        if (this.props.onClick) this.props.onClick(event)

        if (
            !event.defaultPrevented && // onClick prevented default
            event.button === 0 && // ignore everything but left clicks
            (!this.props.target || this.props.target === '_self') && // let browser handle "target=_blank" etc.
            !isModifiedEvent(event) // ignore clicks with modifier keys
        ) {
            event.preventDefault()

            const method = this.props.replace ? history.replace : history.push

            method(this.props.to)
        }
    }

    render() {
        const { innerRef, replace, to, ...rest } = this.props // eslint-disable-line no-unused-vars

        return html` <${context.Consumer}>
            ${(context) => {
                invariant(
                    context,
                    'You should not use <Link> outside a <Router>'
                )

                const location =
                    typeof to === 'string'
                        ? createLocation(to, null, null, context.location)
                        : to
                const href = location
                    ? context.history.createHref(location)
                    : ''

                return html` <a
                    ...${rest}
                    onClick=${(event) =>
                        this.handleClick(event, context.history)}
                    href=${href}
                    ref=${innerRef}
                />`
            }}
        <//>`
    }
}

if (__DEV__) {
    const toType = PropTypes.oneOfType([PropTypes.string, PropTypes.object])
    const innerRefType = PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any }),
    ])

    Link.propTypes = {
        innerRef: innerRefType,
        onClick: PropTypes.func,
        replace: PropTypes.bool,
        target: PropTypes.string,
        to: toType.isRequired,
    }
}

function joinClassnames(...classnames) {
    return classnames.filter((i) => i).join(' ')
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
function NavLink({
    'aria-current': ariaCurrent = 'page',
    activeClassName = 'active',
    activeStyle,
    className: classNameProp,
    exact,
    isActive: isActiveProp,
    location,
    strict,
    style: styleProp,
    to,
    ...rest
}) {
    const path = typeof to === 'object' ? to.pathname : to

    // Regex taken from: https://github.com/pillarjs/path-to-regexp/blob/master/index.js#L202
    const escapedPath =
        path && path.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')

    return html` <${Route}
        path=${escapedPath}
        exact=${exact}
        strict=${strict}
        location=${location}
        children=${({ location, match }) => {
            const isActive = !!(isActiveProp
                ? isActiveProp(match, location)
                : match)

            const className = isActive
                ? joinClassnames(classNameProp, activeClassName)
                : classNameProp
            const style = isActive
                ? { ...styleProp, ...activeStyle }
                : styleProp

            return html` <${Link}
                aria-current=${(isActive && ariaCurrent) || null}
                className=${className}
                style=${style}
                to=${to}
                ...${rest}
            />`
        }}
    />`
}

if (__DEV__) {
    const ariaCurrentType = PropTypes.oneOf([
        'page',
        'step',
        'location',
        'date',
        'time',
        'true',
    ])

    NavLink.propTypes = {
        ...Link.propTypes,
        'aria-current': ariaCurrentType,
        activeClassName: PropTypes.string,
        activeStyle: PropTypes.object,
        className: PropTypes.string,
        exact: Route.propTypes.exact,
        isActive: PropTypes.func,
        location: PropTypes.object,
        strict: Route.propTypes.strict,
        style: PropTypes.object,
    }
}

function matchRoutes(routes, pathname, /*not public API*/ branch = []) {
    routes.some((route) => {
        const match = route.path
            ? matchPath(pathname, route)
            : branch.length
            ? branch[branch.length - 1].match // use parent match
            : Router.computeRootMatch(pathname) // use default "root" match

        if (match) {
            branch.push({ route, match })

            if (route.routes) {
                matchRoutes(route.routes, pathname, branch)
            }
        }

        return match
    })

    return branch
}

function renderRoutes(routes, extraProps = {}, switchProps = {}) {
    return routes
        ? html`<${Switch} ...${switchProps}>
              ${routes.map(
                  (route, i) =>
                      html`<${Route}
                          key=${route.key || i}
                          path=${route.path}
                          exact=${route.exact}
                          strict=${route.strict}
                          render=${(props) =>
                              route.render
                                  ? route.render({
                                        ...props,
                                        ...extraProps,
                                        route: route,
                                    })
                                  : html`<${route.component}
                                        ...${props}
                                        ...${extraProps}
                                        route=${route}
                                    />`}
                      />`
              )}
          <//>`
        : null
}

export {
    BrowserRouter,
    HashRouter,
    Link,
    NavLink,
    matchRoutes,
    renderRoutes,
    MemoryRouter,
    Prompt,
    Redirect,
    Route,
    Router,
    StaticRouter,
    Switch,
    generatePath,
    matchPath,
    withRouter,
    context as __RouterContext,
}
