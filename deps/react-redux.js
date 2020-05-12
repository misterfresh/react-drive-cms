function createListenerCollection() {
    let t = [],
        e = []
    return {
        clear() {
            ;(e = CLEARED), (t = CLEARED)
        },
        notify() {
            const r = (t = e)
            for (let t = 0; t < r.length; t++) r[t]()
        },
        get: () => e,
        subscribe(r) {
            let o = !0
            return (
                e === t && (e = t.slice()),
                e.push(r),
                function () {
                    o &&
                        t !== CLEARED &&
                        ((o = !1),
                        e === t && (e = t.slice()),
                        e.splice(e.indexOf(r), 1))
                }
            )
        },
    }
}
function is(t, e) {
    return t === e ? 0 !== t || 0 !== e || 1 / t == 1 / e : t !== t && e !== e
}
function shallowEqual(t, e) {
    if (is(t, e)) return !0
    if (
        'object' != typeof t ||
        null === t ||
        'object' != typeof e ||
        null === e
    )
        return !1
    const r = Object.keys(t),
        o = Object.keys(e)
    if (r.length !== o.length) return !1
    for (let o = 0; o < r.length; o++)
        if (!hasOwn.call(e, r[o]) || !is(t[r[o]], e[r[o]])) return !1
    return !0
}
function warning(t) {
    'undefined' != typeof console &&
        'function' == typeof console.error &&
        console.error(t)
    try {
        throw new Error(t)
    } catch (t) {}
}
function isObjectLike(t) {
    return null != t && 'object' == typeof t
}
function overArg(t, e) {
    return function (r) {
        return t(e(r))
    }
}
function objectToString(t) {
    return nativeObjectToString.call(t)
}
function getRawTag(t) {
    var e = hasOwnProperty.call(t, symToStringTag),
        r = t[symToStringTag]
    try {
        t[symToStringTag] = void 0
        var o = !0
    } catch (t) {}
    var n = nativeObjectToString.call(t)
    return o && (e ? (t[symToStringTag] = r) : delete t[symToStringTag]), n
}
function baseGetTag(t) {
    return null == t
        ? void 0 === t
            ? undefinedTag
            : nullTag
        : symToStringTag && symToStringTag in Object(t)
        ? getRawTag(t)
        : objectToString(t)
}
function isPlainObject(t) {
    if (!isObjectLike(t) || baseGetTag(t) != objectTag) return !1
    var e = getPrototype(t)
    if (null === e) return !0
    var r = hasOwnProperty.call(e, 'constructor') && e.constructor
    return (
        'function' == typeof r &&
        r instanceof r &&
        funcToString.call(r) == objectCtorString
    )
}
function verifyPlainObject(t, e, r) {
    isPlainObject(t) ||
        warning(
            `${r}() in ${e} must return a plain object. Instead received ${t}.`
        )
}
function wrapActionCreators(t) {
    return (e) => bindActionCreators(t, e)
}
function warnAboutReceivingStore() {
    didWarnAboutReceivingStore ||
        ((didWarnAboutReceivingStore = !0),
        warning(
            '<Provider> does not support changing `store` on the fly. It is most likely that you see this error because you updated to Redux 2.x and React Redux 2.x which no longer hot reload reducers automatically. See https://github.com/reactjs/react-redux/releases/tag/v2.0.0 for the migration instructions.'
        ))
}
function createProvider(t = 'store', e) {
    const r = e || `${t}Subscription`
    class o extends Component {
        getChildContext() {
            return { [t]: this[t], [r]: null }
        }
        constructor(e, r) {
            super(e, r), (this[t] = e.store)
        }
        render() {
            return Children.only(this.props.children)
        }
    }
    return (
        (o.prototype.componentWillReceiveProps = function (e) {
            this[t] !== e.store && warnAboutReceivingStore()
        }),
        (o.propTypes = {
            store: storeShape.isRequired,
            children: PropTypes.element.isRequired,
        }),
        (o.childContextTypes = {
            [t]: storeShape.isRequired,
            [r]: subscriptionShape,
        }),
        o
    )
}
function hoistNonReactStatics(t, e, r) {
    if ('string' != typeof e) {
        if (objectPrototype) {
            var o = getPrototypeOf(e)
            o && o !== objectPrototype && hoistNonReactStatics(t, o, r)
        }
        var n = getOwnPropertyNames(e)
        getOwnPropertySymbols && (n = n.concat(getOwnPropertySymbols(e)))
        for (var s = 0; s < n.length; ++s) {
            var i = n[s]
            if (!(REACT_STATICS[i] || KNOWN_STATICS[i] || (r && r[i]))) {
                var p = getOwnPropertyDescriptor(e, i)
                try {
                    defineProperty(t, i, p)
                } catch (t) {}
            }
        }
        return t
    }
    return t
}
function noop() {}
function makeSelectorStateful(t, e) {
    const r = {
        run: function (o) {
            try {
                const n = t(e.getState(), o)
                ;(n !== r.props || r.error) &&
                    ((r.shouldComponentUpdate = !0),
                    (r.props = n),
                    (r.error = null))
            } catch (t) {
                ;(r.shouldComponentUpdate = !0), (r.error = t)
            }
        },
    }
    return r
}
function connectAdvanced(
    t,
    {
        getDisplayName: e = (t) => `ConnectAdvanced(${t})`,
        methodName: r = 'connectAdvanced',
        renderCountProp: o,
        shouldHandleStateChanges: n = !0,
        storeKey: s = 'store',
        withRef: i = !1,
        ...p
    } = {}
) {
    const c = s + 'Subscription',
        a = hotReloadingVersion++,
        u = { [s]: storeShape, [c]: subscriptionShape },
        l = { [c]: subscriptionShape }
    return function (d) {
        invariant(
            'function' == typeof d,
            `You must pass a component to the function returned by ` +
                `connect. Instead received ${JSON.stringify(d)}`
        )
        const h = d.displayName || d.name || 'Component',
            f = e(h),
            b = {
                ...p,
                getDisplayName: e,
                methodName: r,
                renderCountProp: o,
                shouldHandleStateChanges: n,
                storeKey: s,
                withRef: i,
                displayName: f,
                wrappedComponentName: h,
                WrappedComponent: d,
            }
        class y extends Component {
            constructor(t, e) {
                super(t, e),
                    (this.version = a),
                    (this.state = {}),
                    (this.renderCount = 0),
                    (this.store = t[s] || e[s]),
                    (this.propsMode = Boolean(t[s])),
                    (this.setWrappedInstance = this.setWrappedInstance.bind(
                        this
                    )),
                    invariant(
                        this.store,
                        `Could not find "${s}" in either the context or props of ` +
                            `"${f}". Either wrap the root component in a <Provider>, ` +
                            `or explicitly pass "${s}" as a prop to "${f}".`
                    ),
                    this.initSelector(),
                    this.initSubscription()
            }
            getChildContext() {
                const t = this.propsMode ? null : this.subscription
                return { [c]: t || this.context[c] }
            }
            componentDidMount() {
                n &&
                    (this.subscription.trySubscribe(),
                    this.selector.run(this.props),
                    this.selector.shouldComponentUpdate && this.forceUpdate())
            }
            componentWillReceiveProps(t) {
                this.selector.run(t)
            }
            shouldComponentUpdate() {
                return this.selector.shouldComponentUpdate
            }
            componentWillUnmount() {
                this.subscription && this.subscription.tryUnsubscribe(),
                    (this.subscription = null),
                    (this.notifyNestedSubs = noop),
                    (this.store = null),
                    (this.selector.run = noop),
                    (this.selector.shouldComponentUpdate = !1)
            }
            getWrappedInstance() {
                return (
                    invariant(
                        i,
                        `To access the wrapped instance, you need to specify ` +
                            `{ withRef: true } in the options argument of the ${r}() call.`
                    ),
                    this.wrappedInstance
                )
            }
            setWrappedInstance(t) {
                this.wrappedInstance = t
            }
            initSelector() {
                const e = t(this.store.dispatch, b)
                ;(this.selector = makeSelectorStateful(e, this.store)),
                    this.selector.run(this.props)
            }
            initSubscription() {
                if (!n) return
                const t = (this.propsMode ? this.props : this.context)[c]
                ;(this.subscription = new Subscription(
                    this.store,
                    t,
                    this.onStateChange.bind(this)
                )),
                    (this.notifyNestedSubs = this.subscription.notifyNestedSubs.bind(
                        this.subscription
                    ))
            }
            onStateChange() {
                this.selector.run(this.props),
                    this.selector.shouldComponentUpdate
                        ? ((this.componentDidUpdate = this.notifyNestedSubsOnComponentDidUpdate),
                          this.setState(dummyState))
                        : this.notifyNestedSubs()
            }
            notifyNestedSubsOnComponentDidUpdate() {
                ;(this.componentDidUpdate = void 0), this.notifyNestedSubs()
            }
            isSubscribed() {
                return (
                    Boolean(this.subscription) &&
                    this.subscription.isSubscribed()
                )
            }
            addExtraProps(t) {
                if (!(i || o || (this.propsMode && this.subscription))) return t
                const e = { ...t }
                return (
                    i && (e.ref = this.setWrappedInstance),
                    o && (e[o] = this.renderCount++),
                    this.propsMode &&
                        this.subscription &&
                        (e[c] = this.subscription),
                    e
                )
            }
            render() {
                const t = this.selector
                if (((t.shouldComponentUpdate = !1), t.error)) throw t.error
                return createElement(d, this.addExtraProps(t.props))
            }
        }
        return (
            (y.WrappedComponent = d),
            (y.displayName = f),
            (y.childContextTypes = l),
            (y.contextTypes = u),
            (y.propTypes = u),
            (y.prototype.componentWillUpdate = function () {
                if (this.version !== a) {
                    ;(this.version = a), this.initSelector()
                    let t = []
                    this.subscription &&
                        ((t = this.subscription.listeners.get()),
                        this.subscription.tryUnsubscribe()),
                        this.initSubscription(),
                        n &&
                            (this.subscription.trySubscribe(),
                            t.forEach((t) =>
                                this.subscription.listeners.subscribe(t)
                            ))
                }
            }),
            hoistStatics(y, d)
        )
    }
}
function verify(t, e, r) {
    if (!t) throw new Error(`Unexpected value for ${e} in ${r}.`)
    ;('mapStateToProps' !== e && 'mapDispatchToProps' !== e) ||
        t.hasOwnProperty('dependsOnOwnProps') ||
        warning(
            `The selector for ${e} of ${r} did not specify a value for dependsOnOwnProps.`
        )
}
function match(t, e, r) {
    for (let r = e.length - 1; r >= 0; r--) {
        const o = e[r](t)
        if (o) return o
    }
    return (e, o) => {
        throw new Error(
            `Invalid value of type ${typeof t} for ${r} argument when connecting component ${
                o.wrappedComponentName
            }.`
        )
    }
}
function strictEqual(t, e) {
    return t === e
}
import { Component, Children, createElement } from './react.js'
import PropTypes from './prop-types.js'
import { bindActionCreators } from './redux.js'
export const subscriptionShape = PropTypes.shape({
    trySubscribe: PropTypes.func.isRequired,
    tryUnsubscribe: PropTypes.func.isRequired,
    notifyNestedSubs: PropTypes.func.isRequired,
    isSubscribed: PropTypes.func.isRequired,
})
export const storeShape = PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    getState: PropTypes.func.isRequired,
})
const CLEARED = null,
    nullListeners = { notify() {} }
class Subscription {
    constructor(t, e, r) {
        ;(this.store = t),
            (this.parentSub = e),
            (this.onStateChange = r),
            (this.unsubscribe = null),
            (this.listeners = nullListeners)
    }
    addNestedSub(t) {
        return this.trySubscribe(), this.listeners.subscribe(t)
    }
    notifyNestedSubs() {
        this.listeners.notify()
    }
    isSubscribed() {
        return Boolean(this.unsubscribe)
    }
    trySubscribe() {
        this.unsubscribe ||
            ((this.unsubscribe = this.parentSub
                ? this.parentSub.addNestedSub(this.onStateChange)
                : this.store.subscribe(this.onStateChange)),
            (this.listeners = createListenerCollection()))
    }
    tryUnsubscribe() {
        this.unsubscribe &&
            (this.unsubscribe(),
            (this.unsubscribe = null),
            this.listeners.clear(),
            (this.listeners = nullListeners))
    }
}
const hasOwn = Object.prototype.hasOwnProperty
var freeGlobal =
        'object' == typeof global &&
        global &&
        global.Object === Object &&
        global,
    freeSelf =
        'object' == typeof self && self && self.Object === Object && self,
    root = freeGlobal || freeSelf || Function('return this')(),
    Symbol = root.Symbol,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    objectProto = Object.prototype,
    nativeObjectToString = objectProto.toString,
    hasOwnProperty = objectProto.hasOwnProperty,
    symToStringTag = Symbol ? Symbol.toStringTag : void 0,
    nullTag = '[object Null]',
    undefinedTag = '[object Undefined]',
    objectTag = '[object Object]',
    funcProto = Function.prototype,
    funcToString = funcProto.toString,
    objectCtorString = funcToString.call(Object)
let didWarnAboutReceivingStore = !1
var Provider = createProvider(),
    REACT_STATICS = {
        childContextTypes: !0,
        contextTypes: !0,
        defaultProps: !0,
        displayName: !0,
        getDefaultProps: !0,
        mixins: !0,
        propTypes: !0,
        type: !0,
    },
    KNOWN_STATICS = {
        name: !0,
        length: !0,
        prototype: !0,
        caller: !0,
        callee: !0,
        arguments: !0,
        arity: !0,
    },
    defineProperty = Object.defineProperty,
    getOwnPropertyNames = Object.getOwnPropertyNames,
    getOwnPropertySymbols = Object.getOwnPropertySymbols,
    getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
    getPrototypeOf = Object.getPrototypeOf,
    objectPrototype = getPrototypeOf && getPrototypeOf(Object),
    hoistStatics = hoistNonReactStatics,
    invariant = function (t, e, r, o, n, s, i, p) {
        if (void 0 === e)
            throw new Error('invariant requires an error message argument')
        if (!t) {
            var c
            if (void 0 === e)
                c = new Error(
                    'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
                )
            else {
                var a = [r, o, n, s, i, p],
                    u = 0
                ;(c = new Error(
                    e.replace(/%s/g, function () {
                        return a[u++]
                    })
                )).name = 'Invariant Violation'
            }
            throw ((c.framesToPop = 1), c)
        }
    }
let hotReloadingVersion = 0
const dummyState = {}
export function wrapMapToPropsConstant(t) {
    return function (e, r) {
        function o() {
            return n
        }
        const n = t(e, r)
        return (o.dependsOnOwnProps = !1), o
    }
}
export function getDependsOnOwnProps(t) {
    return null !== t.dependsOnOwnProps && void 0 !== t.dependsOnOwnProps
        ? Boolean(t.dependsOnOwnProps)
        : 1 !== t.length
}
export function wrapMapToPropsFunc(t, e) {
    return function (r, { displayName: o }) {
        const n = function (t, e) {
            return n.dependsOnOwnProps ? n.mapToProps(t, e) : n.mapToProps(t)
        }
        return (
            (n.dependsOnOwnProps = !0),
            (n.mapToProps = function (r, s) {
                ;(n.mapToProps = t),
                    (n.dependsOnOwnProps = getDependsOnOwnProps(t))
                let i = n(r, s)
                return (
                    'function' == typeof i &&
                        ((n.mapToProps = i),
                        (n.dependsOnOwnProps = getDependsOnOwnProps(i)),
                        (i = n(r, s))),
                    verifyPlainObject(i, o, e),
                    i
                )
            }),
            n
        )
    }
}
export function verifySubselectors(t, e, r, o) {
    verify(t, 'mapStateToProps', o),
        verify(e, 'mapDispatchToProps', o),
        verify(r, 'mergeProps', o)
}
export function impureFinalPropsSelectorFactory(t, e, r, o) {
    return function (n, s) {
        return r(t(n, s), e(o, s), s)
    }
}
export function pureFinalPropsSelectorFactory(
    t,
    e,
    r,
    o,
    { areStatesEqual: n, areOwnPropsEqual: s, areStatePropsEqual: i }
) {
    function p(n, s) {
        return (
            (d = n),
            (h = s),
            (f = t(d, h)),
            (b = e(o, h)),
            (y = r(f, b, h)),
            (P = !0),
            y
        )
    }
    function c() {
        return (
            (f = t(d, h)),
            e.dependsOnOwnProps && (b = e(o, h)),
            (y = r(f, b, h))
        )
    }
    function a() {
        return (
            t.dependsOnOwnProps && (f = t(d, h)),
            e.dependsOnOwnProps && (b = e(o, h)),
            (y = r(f, b, h))
        )
    }
    function u() {
        const e = t(d, h),
            o = !i(e, f)
        return (f = e), o && (y = r(f, b, h)), y
    }
    function l(t, e) {
        const r = !s(e, h),
            o = !n(t, d)
        return (d = t), (h = e), r && o ? c() : r ? a() : o ? u() : y
    }
    let d,
        h,
        f,
        b,
        y,
        P = !1
    return function (t, e) {
        return P ? l(t, e) : p(t, e)
    }
}
export function finalPropsSelectorFactory(
    t,
    {
        initMapStateToProps: e,
        initMapDispatchToProps: r,
        initMergeProps: o,
        ...n
    }
) {
    const s = e(t, n),
        i = r(t, n),
        p = o(t, n)
    return (
        verifySubselectors(s, i, p, n.displayName),
        (n.pure
            ? pureFinalPropsSelectorFactory
            : impureFinalPropsSelectorFactory)(s, i, p, t, n)
    )
}
export function defaultMergeProps(t, e, r) {
    return { ...r, ...t, ...e }
}
export function wrapMergePropsFunc(t) {
    return function (e, { displayName: r, pure: o, areMergedPropsEqual: n }) {
        let s,
            i = !1
        return function (e, p, c) {
            const a = t(e, p, c)
            return (
                i
                    ? (o && n(a, s)) || (s = a)
                    : ((i = !0), verifyPlainObject((s = a), r, 'mergeProps')),
                s
            )
        }
    }
}
export function whenMergePropsIsFunction(t) {
    return 'function' == typeof t ? wrapMergePropsFunc(t) : void 0
}
export function whenMergePropsIsOmitted(t) {
    return t ? void 0 : () => defaultMergeProps
}
export function whenMapStateToPropsIsFunction(t) {
    return 'function' == typeof t
        ? wrapMapToPropsFunc(t, 'mapStateToProps')
        : void 0
}
export function whenMapStateToPropsIsMissing(t) {
    return t ? void 0 : wrapMapToPropsConstant(() => ({}))
}
export function whenMapDispatchToPropsIsFunction(t) {
    return 'function' == typeof t
        ? wrapMapToPropsFunc(t, 'mapDispatchToProps')
        : void 0
}
export function whenMapDispatchToPropsIsMissing(t) {
    return t ? void 0 : wrapMapToPropsConstant((t) => ({ dispatch: t }))
}
export function whenMapDispatchToPropsIsObject(t) {
    return t && 'object' == typeof t
        ? wrapMapToPropsConstant((e) => bindActionCreators(t, e))
        : void 0
}
export function createConnect({
    connectHOC: t = connectAdvanced,
    mapStateToPropsFactories: e = [
        whenMapStateToPropsIsFunction,
        whenMapStateToPropsIsMissing,
    ],
    mapDispatchToPropsFactories: r = [
        whenMapDispatchToPropsIsFunction,
        whenMapDispatchToPropsIsMissing,
        whenMapDispatchToPropsIsObject,
    ],
    mergePropsFactories: o = [
        whenMergePropsIsFunction,
        whenMergePropsIsOmitted,
    ],
    selectorFactory: n = finalPropsSelectorFactory,
} = {}) {
    return function (
        s,
        i,
        p,
        {
            pure: c = !0,
            areStatesEqual: a = strictEqual,
            areOwnPropsEqual: u = shallowEqual,
            areStatePropsEqual: l = shallowEqual,
            areMergedPropsEqual: d = shallowEqual,
            ...h
        } = {}
    ) {
        const f = match(s, e, 'mapStateToProps'),
            b = match(i, r, 'mapDispatchToProps'),
            y = match(p, o, 'mergeProps')
        return t(n, {
            methodName: 'connect',
            getDisplayName: (t) => `Connect(${t})`,
            shouldHandleStateChanges: Boolean(s),
            initMapStateToProps: f,
            initMapDispatchToProps: b,
            initMergeProps: y,
            pure: c,
            areStatesEqual: a,
            areOwnPropsEqual: u,
            areStatePropsEqual: l,
            areMergedPropsEqual: d,
            ...h,
        })
    }
}
var connect = createConnect()
export { Provider, createProvider, connectAdvanced, connect }
