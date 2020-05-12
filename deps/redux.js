function objectToString(e) {
    return nativeObjectToString.call(e)
}
function getRawTag(e) {
    var t = hasOwnProperty.call(e, symToStringTag),
        n = e[symToStringTag]
    try {
        e[symToStringTag] = void 0
        var o = !0
    } catch (e) {}
    var r = nativeObjectToString.call(e)
    return o && (t ? (e[symToStringTag] = n) : delete e[symToStringTag]), r
}
function baseGetTag(e) {
    return null == e
        ? void 0 === e
            ? undefinedTag
            : nullTag
        : symToStringTag && symToStringTag in Object(e)
        ? getRawTag(e)
        : objectToString(e)
}
function overArg(e, t) {
    return function (n) {
        return e(t(n))
    }
}
function isObjectLike(e) {
    return null != e && 'object' == typeof e
}
function isPlainObject(e) {
    if (!isObjectLike(e) || baseGetTag(e) != objectTag) return !1
    var t = getPrototype(e)
    if (null === t) return !0
    var n = hasOwnProperty.call(t, 'constructor') && t.constructor
    return (
        'function' == typeof n &&
        n instanceof n &&
        funcToString.call(n) == objectCtorString
    )
}
function symbolObservablePonyfill(e) {
    var t,
        n = e.Symbol
    return (
        'function' == typeof n
            ? n.observable
                ? (t = n.observable)
                : ((t = n('observable')), (n.observable = t))
            : (t = '@@observable'),
        t
    )
}
function warning(e) {
    'undefined' != typeof console &&
        'function' == typeof console.error &&
        console.error(e)
    try {
        throw new Error(e)
    } catch (e) {}
}
function applyMiddleware(...e) {
    return (t) => (...n) => {
        const o = t(...n)
        let r = o.dispatch,
            i = []
        const c = { getState: o.getState, dispatch: (...e) => r(...e) }
        return (
            (i = e.map((e) => e(c))),
            (r = compose(...i)(o.dispatch)),
            { ...o, dispatch: r }
        )
    }
}
function bindActionCreator(e, t) {
    return function () {
        return t(e.apply(this, arguments))
    }
}
function bindActionCreators(e, t) {
    if ('function' == typeof e) return bindActionCreator(e, t)
    if ('object' != typeof e || null === e)
        throw new Error(
            `bindActionCreators expected an object or a function, instead received ${
                null === e ? 'null' : typeof e
            }. ` +
                `Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?`
        )
    const n = Object.keys(e),
        o = {}
    for (let r = 0; r < n.length; r++) {
        const i = n[r],
            c = e[i]
        'function' == typeof c && (o[i] = bindActionCreator(c, t))
    }
    return o
}
function compose(...e) {
    return 0 === e.length
        ? (e) => e
        : 1 === e.length
        ? e[0]
        : e.reduce((e, t) => (...n) => e(t(...n)))
}
function createStore(e, t, n) {
    function o() {
        f === u && (f = u.slice())
    }
    function r() {
        return s
    }
    function i(e) {
        if ('function' != typeof e)
            throw new Error('Expected listener to be a function.')
        let t = !0
        return (
            o(),
            f.push(e),
            function () {
                if (!t) return
                ;(t = !1), o()
                const n = f.indexOf(e)
                f.splice(n, 1)
            }
        )
    }
    function c(e) {
        if (!isPlainObject(e))
            throw new Error(
                'Actions must be plain objects. Use custom middleware for async actions.'
            )
        if (void 0 === e.type)
            throw new Error(
                'Actions may not have an undefined "type" property. Have you misspelled a constant?'
            )
        if (l) throw new Error('Reducers may not dispatch actions.')
        try {
            ;(l = !0), (s = a(s, e))
        } finally {
            l = !1
        }
        const t = (u = f)
        for (let e = 0; e < t.length; e++) (0, t[e])()
        return e
    }
    if (
        ('function' == typeof t && void 0 === n && ((n = t), (t = void 0)),
        void 0 !== n)
    ) {
        if ('function' != typeof n)
            throw new Error('Expected the enhancer to be a function.')
        return n(createStore)(e, t)
    }
    if ('function' != typeof e)
        throw new Error('Expected the reducer to be a function.')
    let a = e,
        s = t,
        u = [],
        f = u,
        l = !1
    return (
        c({ type: ActionTypes.INIT }),
        {
            dispatch: c,
            subscribe: i,
            getState: r,
            replaceReducer: function (e) {
                if ('function' != typeof e)
                    throw new Error(
                        'Expected the nextReducer to be a function.'
                    )
                ;(a = e), c({ type: ActionTypes.INIT })
            },
            [$$observable]: function () {
                const e = i
                return {
                    subscribe(t) {
                        function n() {
                            t.next && t.next(r())
                        }
                        if ('object' != typeof t)
                            throw new TypeError(
                                'Expected the observer to be an object.'
                            )
                        return n(), { unsubscribe: e(n) }
                    },
                    [$$observable]() {
                        return this
                    },
                }
            },
        }
    )
}
function getUndefinedStateErrorMessage(e, t) {
    const n = t && t.type
    return (
        `Given ${
            (n && `action "${String(n)}"`) || 'an action'
        }, reducer "${e}" returned undefined. ` +
        `To ignore an action, you must explicitly return the previous state. ` +
        `If you want this reducer to hold no value, you can return null instead of undefined.`
    )
}
function getUnexpectedStateShapeWarningMessage(e, t, n, o) {
    const r = Object.keys(t),
        i =
            n && n.type === ActionTypes.INIT
                ? 'preloadedState argument passed to createStore'
                : 'previous state received by the reducer'
    if (0 === r.length)
        return 'Store does not have a valid reducer. Make sure the argument passed to combineReducers is an object whose values are reducers.'
    if (!isPlainObject(e))
        return (
            `The ${i} has unexpected type of "` +
            {}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1] +
            `". Expected argument to be an object with the following ` +
            `keys: "${r.join('", "')}"`
        )
    const c = Object.keys(e).filter((e) => !t.hasOwnProperty(e) && !o[e])
    return (
        c.forEach((e) => {
            o[e] = !0
        }),
        c.length > 0
            ? `Unexpected ${c.length > 1 ? 'keys' : 'key'} ` +
              `"${c.join('", "')}" found in ${i}. ` +
              `Expected to find one of the known reducer keys instead: ` +
              `"${r.join('", "')}". Unexpected keys will be ignored.`
            : void 0
    )
}
function assertReducerShape(e) {
    Object.keys(e).forEach((t) => {
        const n = e[t]
        if (void 0 === n(void 0, { type: ActionTypes.INIT }))
            throw new Error(
                `Reducer "${t}" returned undefined during initialization. ` +
                    `If the state passed to the reducer is undefined, you must ` +
                    `explicitly return the initial state. The initial state may ` +
                    `not be undefined. If you don't want to set a value for this reducer, ` +
                    `you can use null instead of undefined.`
            )
        if (
            void 0 ===
            n(void 0, {
                type:
                    '@@redux/PROBE_UNKNOWN_ACTION_' +
                    Math.random().toString(36).substring(7).split('').join('.'),
            })
        )
            throw new Error(
                `Reducer "${t}" returned undefined when probed with a random type. ` +
                    `Don't try to handle ${ActionTypes.INIT} or other actions in "redux/*" ` +
                    `namespace. They are considered private. Instead, you must return the ` +
                    `current state for any unknown actions, unless it is undefined, ` +
                    `in which case you must return the initial state, regardless of the ` +
                    `action type. The initial state may not be undefined, but can be null.`
            )
    })
}
function combineReducers(e) {
    const t = Object.keys(e),
        n = {}
    for (let o = 0; o < t.length; o++) {
        const r = t[o]
        void 0 === e[r] && warning(`No reducer provided for key "${r}"`),
            'function' == typeof e[r] && (n[r] = e[r])
    }
    const o = Object.keys(n)
    let r
    r = {}
    let i
    try {
        assertReducerShape(n)
    } catch (e) {
        i = e
    }
    return function (e = {}, t) {
        if (i) throw i
        {
            const o = getUnexpectedStateShapeWarningMessage(e, n, t, r)
            o && warning(o)
        }
        let c = !1
        const a = {}
        for (let r = 0; r < o.length; r++) {
            const i = o[r],
                s = n[i],
                u = e[i],
                f = s(u, t)
            if (void 0 === f) {
                const e = getUndefinedStateErrorMessage(i, t)
                throw new Error(e)
            }
            ;(a[i] = f), (c = c || f !== u)
        }
        return c ? a : e
    }
}
var freeGlobal =
        'object' == typeof global &&
        global &&
        global.Object === Object &&
        global,
    freeSelf =
        'object' == typeof self && self && self.Object === Object && self,
    Symbol = (root = freeGlobal || freeSelf || Function('return this')())
        .Symbol,
    nativeObjectToString = (objectProto = Object.prototype).toString,
    hasOwnProperty = objectProto.hasOwnProperty,
    nativeObjectToString = objectProto.toString,
    symToStringTag = Symbol ? Symbol.toStringTag : void 0,
    nullTag = '[object Null]',
    undefinedTag = '[object Undefined]',
    symToStringTag = Symbol ? Symbol.toStringTag : void 0,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectTag = '[object Object]',
    funcProto = Function.prototype,
    objectProto = Object.prototype,
    funcToString = funcProto.toString,
    hasOwnProperty = objectProto.hasOwnProperty,
    objectCtorString = funcToString.call(Object),
    root,
    $$observable = symbolObservablePonyfill(
        (root =
            'undefined' != typeof self
                ? self
                : 'undefined' != typeof window
                ? window
                : 'undefined' != typeof global
                ? global
                : 'undefined' != typeof module
                ? module
                : Function('return this')())
    )
const ActionTypes = { INIT: '@@redux/INIT' }
export {
    createStore,
    combineReducers,
    bindActionCreators,
    applyMiddleware,
    compose,
}
