function isUndefinedOrNull(t) {
    return null === t || void 0 === t
}
function isBuffer(t) {
    return (
        !(!t || 'object' != typeof t || 'number' != typeof t.length) &&
        'function' == typeof t.copy &&
        'function' == typeof t.slice &&
        !(t.length > 0 && 'number' != typeof t[0])
    )
}
function objEquiv(t, e, r) {
    var n, s
    if (isUndefinedOrNull(t) || isUndefinedOrNull(e)) return !1
    if (t.prototype !== e.prototype) return !1
    if (isArguments(t))
        return (
            !!isArguments(e) &&
            ((t = pSlice.call(t)), (e = pSlice.call(e)), deepEqual(t, e, r))
        )
    if (isBuffer(t)) {
        if (!isBuffer(e)) return !1
        if (t.length !== e.length) return !1
        for (n = 0; n < t.length; n++) if (t[n] !== e[n]) return !1
        return !0
    }
    try {
        var o = Object.keys(t),
            T = Object.keys(e)
    } catch (t) {
        return !1
    }
    if (o.length != T.length) return !1
    for (o.sort(), T.sort(), n = o.length - 1; n >= 0; n--)
        if (o[n] != T[n]) return !1
    for (n = o.length - 1; n >= 0; n--)
        if (((s = o[n]), !deepEqual(t[s], e[s], r))) return !1
    return typeof t == typeof e
}
function withSideEffect(t, e, r) {
    function n(t) {
        return t.displayName || t.name || 'Component'
    }
    function s(t, e) {
        for (let r in t) if (!(r in e)) return !0
        for (let r in e) if (t[r] !== e[r]) return !0
        return !1
    }
    if ('function' != typeof t)
        throw new Error('Expected reducePropsToState to be a function.')
    if ('function' != typeof e)
        throw new Error('Expected handleStateChangeOnClient to be a function.')
    if (void 0 !== r && 'function' != typeof r)
        throw new Error(
            'Expected mapStateOnServer to either be undefined or a function.'
        )
    return function (o) {
        function T() {
            ;(a = t(
                i.map(function (t) {
                    return t.props
                })
            )),
                l.canUseDOM ? e(a) : r && (a = r(a))
        }
        if ('function' != typeof o)
            throw new Error(
                'Expected WrappedComponent to be a React component.'
            )
        let a,
            i = []
        class l extends Component {
            shouldComponentUpdate(t) {
                let { children: e, ...r } = t
                return e && e.length && (r.children = e), s(r, this.props)
            }
            componentWillMount() {
                i.push(this), T()
            }
            componentDidUpdate() {
                T()
            }
            componentWillUnmount() {
                const t = i.indexOf(this)
                i.splice(t, 1), T()
            }
            render() {
                return h(o, { ...this.props })
            }
        }
        return (
            (l.displayName = `SideEffect(${n(o)})`),
            (l.canUseDOM = !(
                'undefined' == typeof window ||
                !window.document ||
                !window.document.createElement
            )),
            (l.peek = () => a),
            (l.rewind = () => {
                if (l.canUseDOM)
                    throw new Error(
                        'You may only call rewind() on the server. Call peek() to read the current state.'
                    )
                let t = a
                return (a = void 0), (i = []), t
            }),
            l
        )
    }
}
import { createElement as h, Component } from './react.js'
var pSlice = Array.prototype.slice,
    isArguments = function (t) {
        return '[object Arguments]' == Object.prototype.toString.call(t)
    },
    deepEqual = function (t, e, r) {
        return (
            r || (r = {}),
            t === e ||
                (t instanceof Date && e instanceof Date
                    ? t.getTime() === e.getTime()
                    : !t || !e || ('object' != typeof t && 'object' != typeof e)
                    ? r.strict
                        ? t === e
                        : t == e
                    : objEquiv(t, e, r))
        )
    }
export const TAG_NAMES = {
    HTML: 'htmlAttributes',
    TITLE: 'title',
    BASE: 'base',
    META: 'meta',
    LINK: 'link',
    SCRIPT: 'script',
    NOSCRIPT: 'noscript',
    STYLE: 'style',
}
export const TAG_PROPERTIES = {
    NAME: 'name',
    CHARSET: 'charset',
    HTTPEQUIV: 'http-equiv',
    REL: 'rel',
    HREF: 'href',
    PROPERTY: 'property',
    SRC: 'src',
    INNER_HTML: 'innerHTML',
    CSS_TEXT: 'cssText',
    ITEM_PROP: 'itemprop',
}
export const PREACT_TAG_MAP = {
    charset: 'charSet',
    'http-equiv': 'httpEquiv',
    itemprop: 'itemProp',
    class: 'className',
}
const HELMET_ATTRIBUTE = 'data-preact-helmet',
    encodeSpecialCharacters = (t) =>
        String(t)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;'),
    getInnermostProperty = (t, e) => {
        for (let r = t.length - 1; r >= 0; r--) {
            const n = t[r]
            if (n[e]) return n[e]
        }
        return null
    },
    getTitleFromPropsList = (t) => {
        const e = getInnermostProperty(t, 'title'),
            r = getInnermostProperty(t, 'titleTemplate')
        if (r && e) return r.replace(/%s/g, () => e)
        const n = getInnermostProperty(t, 'defaultTitle')
        return e || n || ''
    },
    getOnChangeClientState = (t) =>
        getInnermostProperty(t, 'onChangeClientState') || (() => {}),
    getAttributesFromPropsList = (t, e) =>
        e
            .filter((e) => void 0 !== e[t])
            .map((e) => e[t])
            .reduce((t, e) => ({ ...t, ...e }), {}),
    getBaseTagFromPropsList = (t, e) =>
        e
            .filter((t) => void 0 !== t[TAG_NAMES.BASE])
            .map((t) => t[TAG_NAMES.BASE])
            .reverse()
            .reduce((e, r) => {
                if (!e.length) {
                    const n = Object.keys(r)
                    for (let s = 0; s < n.length; s++) {
                        const o = n[s].toLowerCase()
                        if (-1 !== t.indexOf(o) && r[o]) return e.concat(r)
                    }
                }
                return e
            }, []),
    getTagsFromPropsList = (t, e, r) => {
        const n = {}
        return r
            .filter((e) => void 0 !== e[t])
            .map((e) => e[t])
            .reverse()
            .reduce((t, r) => {
                const s = {}
                r.filter((t) => {
                    let r
                    const o = Object.keys(t)
                    for (let n = 0; n < o.length; n++) {
                        const s = o[n],
                            T = s.toLowerCase()
                        ;-1 === e.indexOf(T) ||
                            (r === TAG_PROPERTIES.REL &&
                                'canonical' === t[r].toLowerCase()) ||
                            (T === TAG_PROPERTIES.REL &&
                                'stylesheet' === t[T].toLowerCase()) ||
                            (r = T),
                            -1 === e.indexOf(s) ||
                                (s !== TAG_PROPERTIES.INNER_HTML &&
                                    s !== TAG_PROPERTIES.CSS_TEXT &&
                                    s !== TAG_PROPERTIES.ITEM_PROP) ||
                                (r = s)
                    }
                    if (!r || !t[r]) return !1
                    const T = t[r].toLowerCase()
                    return (
                        n[r] || (n[r] = {}),
                        s[r] || (s[r] = {}),
                        !n[r][T] && ((s[r][T] = !0), !0)
                    )
                })
                    .reverse()
                    .forEach((e) => t.push(e))
                const o = Object.keys(s)
                for (let t = 0; t < o.length; t++) {
                    const e = o[t],
                        r = Object.assign({}, n[e], s[e])
                    n[e] = r
                }
                return t
            }, [])
            .reverse()
    },
    updateTitle = (t, e) => {
        ;(document.title = t || document.title),
            updateAttributes(TAG_NAMES.TITLE, e)
    },
    updateAttributes = (t, e) => {
        const r = document.getElementsByTagName(t)[0],
            n = r.getAttribute(HELMET_ATTRIBUTE),
            s = n ? n.split(',') : [],
            o = [].concat(s),
            T = Object.keys(e)
        for (let t = 0; t < T.length; t++) {
            const n = T[t],
                a = e[n] || ''
            r.setAttribute(n, a), -1 === s.indexOf(n) && s.push(n)
            const i = o.indexOf(n)
            ;-1 !== i && o.splice(i, 1)
        }
        for (let t = o.length - 1; t >= 0; t--) r.removeAttribute(o[t])
        s.length === o.length
            ? r.removeAttribute(HELMET_ATTRIBUTE)
            : r.setAttribute(HELMET_ATTRIBUTE, s.join(','))
    },
    updateTags = (t, e) => {
        const r = document.head || document.querySelector('head'),
            n = r.querySelectorAll(`${t}[data-preact-helmet]`),
            s = Array.prototype.slice.call(n),
            o = []
        let T
        return (
            e &&
                e.length &&
                e.forEach((e) => {
                    const r = document.createElement(t)
                    for (const t in e)
                        if (e.hasOwnProperty(t))
                            if ('innerHTML' === t) r.innerHTML = e.innerHTML
                            else if ('cssText' === t)
                                r.styleSheet
                                    ? (r.styleSheet.cssText = e.cssText)
                                    : r.appendChild(
                                          document.createTextNode(e.cssText)
                                      )
                            else {
                                const n = void 0 === e[t] ? '' : e[t]
                                r.setAttribute(t, n)
                            }
                    r.setAttribute(HELMET_ATTRIBUTE, 'true'),
                        s.some((t, e) => ((T = e), r.isEqualNode(t)))
                            ? s.splice(T, 1)
                            : o.push(r)
                }),
            s.forEach((t) => t.parentNode.removeChild(t)),
            o.forEach((t) => r.appendChild(t)),
            { oldTags: s, newTags: o }
        )
    },
    generateHtmlAttributesAsString = (t) =>
        Object.keys(t).reduce((e, r) => {
            const n = void 0 !== t[r] ? `${r}="${t[r]}"` : `${r}`
            return e ? `${e} ${n}` : n
        }, ''),
    generateTitleAsString = (t, e, r) => {
        const n = generateHtmlAttributesAsString(r)
        return n
            ? `<${t} data-preact-helmet ${n}>${encodeSpecialCharacters(
                  e
              )}</${t}>`
            : `<${t} data-preact-helmet>${encodeSpecialCharacters(e)}</${t}>`
    },
    generateTagsAsString = (t, e) =>
        e.reduce((e, r) => {
            const n = Object.keys(r)
                    .filter((t) => !('innerHTML' === t || 'cssText' === t))
                    .reduce((t, e) => {
                        const n =
                            void 0 === r[e]
                                ? e
                                : `${e}="${encodeSpecialCharacters(r[e])}"`
                        return t ? `${t} ${n}` : n
                    }, ''),
                s = r.innerHTML || r.cssText || '',
                o =
                    -1 ===
                    [
                        TAG_NAMES.NOSCRIPT,
                        TAG_NAMES.SCRIPT,
                        TAG_NAMES.STYLE,
                    ].indexOf(t)
            return `${e}<${t} data-preact-helmet ${n}${
                o ? `>` : `>${s}</${t}>`
            }`
        }, ''),
    generateTitleAsPreactComponent = (t, e, r) => {
        const n = { key: e, [HELMET_ATTRIBUTE]: !0 },
            s = Object.keys(r).reduce((t, e) => ((t[e] = r[e]), t), n)
        return [h(TAG_NAMES.TITLE, s, e)]
    },
    generateTagsAsPreactComponent = (t, e) =>
        e.map((e, r) => {
            const n = { key: r, [HELMET_ATTRIBUTE]: !0 }
            return (
                Object.keys(e).forEach((t) => {
                    const r = t
                    if ('innerHTML' === r || 'cssText' === r) {
                        const t = e.innerHTML || e.cssText
                        n.dangerouslySetInnerHTML = { __html: t }
                    } else n[r] = e[t]
                }),
                h(t, n)
            )
        }),
    getMethodsForTag = (t, e) => {
        switch (t) {
            case TAG_NAMES.TITLE:
                return {
                    toComponent: () =>
                        generateTitleAsPreactComponent(
                            0,
                            e.title,
                            e.titleAttributes
                        ),
                    toString: () =>
                        generateTitleAsString(t, e.title, e.titleAttributes),
                }
            case TAG_NAMES.HTML:
                return {
                    toComponent: () => e,
                    toString: () => generateHtmlAttributesAsString(e),
                }
            default:
                return {
                    toComponent: () => generateTagsAsPreactComponent(t, e),
                    toString: () => generateTagsAsString(t, e),
                }
        }
    },
    mapStateOnServer = ({
        htmlAttributes: t,
        title: e,
        titleAttributes: r,
        baseTag: n,
        metaTags: s,
        linkTags: o,
        scriptTags: T,
        noscriptTags: a,
        styleTags: i,
    }) => ({
        htmlAttributes: getMethodsForTag(TAG_NAMES.HTML, t),
        title: getMethodsForTag(TAG_NAMES.TITLE, {
            title: e,
            titleAttributes: r,
        }),
        base: getMethodsForTag(TAG_NAMES.BASE, n),
        meta: getMethodsForTag(TAG_NAMES.META, s),
        link: getMethodsForTag(TAG_NAMES.LINK, o),
        script: getMethodsForTag(TAG_NAMES.SCRIPT, T),
        noscript: getMethodsForTag(TAG_NAMES.NOSCRIPT, a),
        style: getMethodsForTag(TAG_NAMES.STYLE, i),
    }),
    Helmet = (t) => {
        class e extends Component {
            static set canUseDOM(e) {
                t.canUseDOM = e
            }
            shouldComponentUpdate(t) {
                const e = { ...t }
                return (
                    (e.children && e.children.length) || delete e.children,
                    !deepEqual(this.props, e)
                )
            }
            render() {
                return h(t, { ...this.props })
            }
        }
        return (
            (e.peek = (...e) => t.peek(...e)),
            (e.rewind = () => {
                let e = t.rewind()
                return (
                    e ||
                        (e = mapStateOnServer({
                            htmlAttributes: {},
                            title: '',
                            titleAttributes: {},
                            baseTag: [],
                            metaTags: [],
                            linkTags: [],
                            scriptTags: [],
                            noscriptTags: [],
                            styleTags: [],
                        })),
                    e
                )
            }),
            e
        )
    },
    reducePropsToState = (t) => ({
        htmlAttributes: getAttributesFromPropsList(TAG_NAMES.HTML, t),
        title: getTitleFromPropsList(t),
        titleAttributes: getAttributesFromPropsList('titleAttributes', t),
        baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], t),
        metaTags: getTagsFromPropsList(
            TAG_NAMES.META,
            [
                TAG_PROPERTIES.NAME,
                TAG_PROPERTIES.CHARSET,
                TAG_PROPERTIES.HTTPEQUIV,
                TAG_PROPERTIES.PROPERTY,
                TAG_PROPERTIES.ITEM_PROP,
            ],
            t
        ),
        linkTags: getTagsFromPropsList(
            TAG_NAMES.LINK,
            [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF],
            t
        ),
        scriptTags: getTagsFromPropsList(
            TAG_NAMES.SCRIPT,
            [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
            t
        ),
        noscriptTags: getTagsFromPropsList(
            TAG_NAMES.NOSCRIPT,
            [TAG_PROPERTIES.INNER_HTML],
            t
        ),
        styleTags: getTagsFromPropsList(
            TAG_NAMES.STYLE,
            [TAG_PROPERTIES.CSS_TEXT],
            t
        ),
        onChangeClientState: getOnChangeClientState(t),
    }),
    handleClientStateChange = (t) => {
        const {
            htmlAttributes: e,
            title: r,
            titleAttributes: n,
            baseTag: s,
            metaTags: o,
            linkTags: T,
            scriptTags: a,
            noscriptTags: i,
            styleTags: l,
            onChangeClientState: c,
        } = t
        updateAttributes('html', e), updateTitle(r, n)
        const g = {
                baseTag: updateTags(TAG_NAMES.BASE, s),
                metaTags: updateTags(TAG_NAMES.META, o),
                linkTags: updateTags(TAG_NAMES.LINK, T),
                scriptTags: updateTags(TAG_NAMES.SCRIPT, a),
                noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, i),
                styleTags: updateTags(TAG_NAMES.STYLE, l),
            },
            E = {},
            p = {}
        Object.keys(g).forEach((t) => {
            const { newTags: e, oldTags: r } = g[t]
            e.length && (E[t] = e), r.length && (p[t] = g[t].oldTags)
        }),
            c(t, E, p)
    },
    NullComponent = () => null,
    HelmetSideEffects = withSideEffect(
        (t) => ({
            htmlAttributes: getAttributesFromPropsList(TAG_NAMES.HTML, t),
            title: getTitleFromPropsList(t),
            titleAttributes: getAttributesFromPropsList('titleAttributes', t),
            baseTag: getBaseTagFromPropsList([TAG_PROPERTIES.HREF], t),
            metaTags: getTagsFromPropsList(
                TAG_NAMES.META,
                [
                    TAG_PROPERTIES.NAME,
                    TAG_PROPERTIES.CHARSET,
                    TAG_PROPERTIES.HTTPEQUIV,
                    TAG_PROPERTIES.PROPERTY,
                    TAG_PROPERTIES.ITEM_PROP,
                ],
                t
            ),
            linkTags: getTagsFromPropsList(
                TAG_NAMES.LINK,
                [TAG_PROPERTIES.REL, TAG_PROPERTIES.HREF],
                t
            ),
            scriptTags: getTagsFromPropsList(
                TAG_NAMES.SCRIPT,
                [TAG_PROPERTIES.SRC, TAG_PROPERTIES.INNER_HTML],
                t
            ),
            noscriptTags: getTagsFromPropsList(
                TAG_NAMES.NOSCRIPT,
                [TAG_PROPERTIES.INNER_HTML],
                t
            ),
            styleTags: getTagsFromPropsList(
                TAG_NAMES.STYLE,
                [TAG_PROPERTIES.CSS_TEXT],
                t
            ),
            onChangeClientState: getOnChangeClientState(t),
        }),
        (t) => {
            const {
                htmlAttributes: e,
                title: r,
                titleAttributes: n,
                baseTag: s,
                metaTags: o,
                linkTags: T,
                scriptTags: a,
                noscriptTags: i,
                styleTags: l,
                onChangeClientState: c,
            } = t
            updateAttributes('html', e), updateTitle(r, n)
            const g = {
                    baseTag: updateTags(TAG_NAMES.BASE, s),
                    metaTags: updateTags(TAG_NAMES.META, o),
                    linkTags: updateTags(TAG_NAMES.LINK, T),
                    scriptTags: updateTags(TAG_NAMES.SCRIPT, a),
                    noscriptTags: updateTags(TAG_NAMES.NOSCRIPT, i),
                    styleTags: updateTags(TAG_NAMES.STYLE, l),
                },
                E = {},
                p = {}
            Object.keys(g).forEach((t) => {
                const { newTags: e, oldTags: r } = g[t]
                e.length && (E[t] = e), r.length && (p[t] = g[t].oldTags)
            }),
                c(t, E, p)
        },
        mapStateOnServer
    )(() => null)
let HelmetW = ((t) => {
    class e extends Component {
        static set canUseDOM(e) {
            t.canUseDOM = e
        }
        shouldComponentUpdate(t) {
            const e = { ...t }
            return (
                (e.children && e.children.length) || delete e.children,
                !deepEqual(this.props, e)
            )
        }
        render() {
            return h(t, { ...this.props })
        }
    }
    return (
        (e.peek = (...e) => t.peek(...e)),
        (e.rewind = () => {
            let e = t.rewind()
            return (
                e ||
                    (e = mapStateOnServer({
                        htmlAttributes: {},
                        title: '',
                        titleAttributes: {},
                        baseTag: [],
                        metaTags: [],
                        linkTags: [],
                        scriptTags: [],
                        noscriptTags: [],
                        styleTags: [],
                    })),
                e
            )
        }),
        e
    )
})(HelmetSideEffects)
export { HelmetW as Helmet }
export default HelmetW
