let process
function capitalizeString(e) {
    return e.charAt(0).toUpperCase() + e.slice(1)
}
function prefixProperty(e, t, i) {
    if (e.hasOwnProperty(t)) {
        const n = {},
            r = e[t],
            s = capitalizeString(t),
            o = Object.keys(i)
        for (let e = 0; e < o.length; e++) {
            const a = o[e]
            if (a === t) for (let e = 0; e < r.length; e++) n[r[e] + s] = i[t]
            n[a] = i[a]
        }
        return n
    }
    return i
}
function prefixValue(e, t, i, n, r) {
    for (let r = 0, s = e.length; r < s; ++r) {
        const s = e[r](t, i, n, r)
        if (s) return s
    }
}
function addIfNew(e, t) {
    ;-1 === e.indexOf(t) && e.push(t)
}
function addNewValuesOnly(e, t) {
    if (Array.isArray(t))
        for (let i = 0, n = t.length; i < n; ++i) addIfNew(e, t[i])
    else addIfNew(e, t)
}
function isObject(e) {
    return e instanceof Object && !Array.isArray(e)
}
function createPrefixer({ prefixMap: e, plugins: t }) {
    return function i(n) {
        for (const r in n) {
            const s = n[r]
            if (isObject(s)) n[r] = i(s)
            else if (Array.isArray(s)) {
                const i = []
                for (let o = 0, a = s.length; o < a; ++o)
                    addNewValuesOnly(i, prefixValue(t, r, s[o], n, e) || s[o])
                i.length > 0 && (n[r] = i)
            } else {
                const i = prefixValue(t, r, s, n, e)
                i && (n[r] = i), (n = prefixProperty(e, r, n))
            }
        }
        return n
    }
}
function isPrefixedValue(e) {
    return 'string' == typeof e && /-webkit-|-moz-|-ms-/.test(e)
}
function calc(e, t) {
    let i = ['-webkit-', '-moz-', '']
    if ('string' == typeof t && !isPrefixedValue(t) && t.indexOf('calc(') > -1)
        return i.map((e) => t.replace(/calc\(/g, `${e}calc(`))
}
function crossFade(e, t) {
    let i = ['-webkit-', '']
    if (
        'string' == typeof t &&
        !isPrefixedValue(t) &&
        t.indexOf('cross-fade(') > -1
    )
        return i.map((e) => t.replace(/cross-fade\(/g, `${e}cross-fade(`))
}
function cursor(e, t) {
    let i = ['-webkit-', '-moz-', '']
    if (
        'cursor' === e &&
        {
            'zoom-in': !0,
            'zoom-out': !0,
            grab: !0,
            grabbing: !0,
        }.hasOwnProperty(t)
    )
        return i.map((e) => e + t)
}
function filter(e, t) {
    let i = ['-webkit-', '']
    if (
        'string' == typeof t &&
        !isPrefixedValue(t) &&
        t.indexOf('filter(') > -1
    )
        return i.map((e) => t.replace(/filter\(/g, `${e}filter(`))
}
function flex(e, t) {
    let i = {
        flex: [
            '-webkit-box',
            '-moz-box',
            '-ms-flexbox',
            '-webkit-flex',
            'flex',
        ],
        'inline-flex': [
            '-webkit-inline-box',
            '-moz-inline-box',
            '-ms-inline-flexbox',
            '-webkit-inline-flex',
            'inline-flex',
        ],
    }
    if ('display' === e && i.hasOwnProperty(t)) return i[t]
}
function flexboxIE(e, t, i) {
    let n = {
            'space-around': 'distribute',
            'space-between': 'justify',
            'flex-start': 'start',
            'flex-end': 'end',
        },
        r = {
            alignContent: 'msFlexLinePack',
            alignSelf: 'msFlexItemAlign',
            alignItems: 'msFlexAlign',
            justifyContent: 'msFlexPack',
            order: 'msFlexOrder',
            flexGrow: 'msFlexPositive',
            flexShrink: 'msFlexNegative',
            flexBasis: 'msFlexPreferredSize',
        }
    r.hasOwnProperty(e) && (i[r[e]] = n[t] || t)
}
function flexboxOld(e, t, i) {
    let n = {
            'space-around': 'justify',
            'space-between': 'justify',
            'flex-start': 'start',
            'flex-end': 'end',
            'wrap-reverse': 'multiple',
            wrap: 'multiple',
        },
        r = {
            alignItems: 'WebkitBoxAlign',
            justifyContent: 'WebkitBoxPack',
            flexWrap: 'WebkitBoxLines',
        }
    'flexDirection' === e &&
        'string' == typeof t &&
        (t.indexOf('column') > -1
            ? (i.WebkitBoxOrient = 'vertical')
            : (i.WebkitBoxOrient = 'horizontal'),
        t.indexOf('reverse') > -1
            ? (i.WebkitBoxDirection = 'reverse')
            : (i.WebkitBoxDirection = 'normal')),
        r.hasOwnProperty(e) && (i[r[e]] = n[t] || t)
}
function gradient(e, t) {
    let i = ['-webkit-', '-moz-', '']
    if (
        'string' == typeof t &&
        !isPrefixedValue(t) &&
        /linear-gradient|radial-gradient|repeating-linear-gradient|repeating-radial-gradient/.test(
            t
        )
    )
        return i.map((e) => e + t)
}
function imageSet(e, t) {
    const i = ['-webkit-', '']
    if (
        'string' == typeof t &&
        !isPrefixedValue(t) &&
        t.indexOf('image-set(') > -1
    )
        return i.map((e) => t.replace(/image-set\(/g, `${e}image-set(`))
}
function position(e, t) {
    if ('position' === e && 'sticky' === t) return ['-webkit-sticky', 'sticky']
}
function sizing(e, t) {
    let i = ['-webkit-', '-moz-', '']
    if (
        {
            maxHeight: !0,
            maxWidth: !0,
            width: !0,
            height: !0,
            columnWidth: !0,
            minWidth: !0,
            minHeight: !0,
        }.hasOwnProperty(e) &&
        {
            'min-content': !0,
            'max-content': !0,
            'fill-available': !0,
            'fit-content': !0,
            'contain-floats': !0,
        }.hasOwnProperty(t)
    )
        return i.map((e) => e + t)
}
function hyphenateStyleName(e) {
    let t = {}
    return e in t
        ? t[e]
        : (t[e] = e
              .replace(/[A-Z]/g, '-$&')
              .toLowerCase()
              .replace(/^ms-/, '-ms-'))
}
function hyphenateProperty(e) {
    return hyphenateStyleName(e)
}
function transition(e, t, i, n) {
    let r = { Webkit: '-webkit-', Moz: '-moz-', ms: '-ms-' }
    if (
        'string' == typeof t &&
        {
            transition: !0,
            transitionProperty: !0,
            WebkitTransition: !0,
            WebkitTransitionProperty: !0,
            MozTransition: !0,
            MozTransitionProperty: !0,
        }.hasOwnProperty(e)
    ) {
        const s = (function (e, t) {
                if (isPrefixedValue(e)) return e
                const i = e.split(/,(?![^()]*(?:\([^()]*\))?\))/g)
                for (let e = 0, n = i.length; e < n; ++e) {
                    const n = i[e],
                        s = [n]
                    for (const e in t) {
                        const i = hyphenateProperty(e)
                        if (n.indexOf(i) > -1 && 'order' !== i) {
                            const o = t[e]
                            for (let e = 0, t = o.length; e < t; ++e)
                                s.unshift(n.replace(i, r[o[e]] + i))
                        }
                    }
                    i[e] = s.join(',')
                }
                return i.join(',')
            })(t, n),
            o = s
                .split(/,(?![^()]*(?:\([^()]*\))?\))/g)
                .filter((e) => !/-moz-|-ms-/.test(e))
                .join(',')
        if (e.indexOf('Webkit') > -1) return o
        const a = s
            .split(/,(?![^()]*(?:\([^()]*\))?\))/g)
            .filter((e) => !/-webkit-|-ms-/.test(e))
            .join(',')
        return e.indexOf('Moz') > -1
            ? a
            : ((i[`Webkit${capitalizeString(e)}`] = o),
              (i[`Moz${capitalizeString(e)}`] = a),
              s)
    }
}
process || (process = { env: { NODE_ENV: 'production' } })
let asap,
    staticData = {
        plugins: [
            calc,
            crossFade,
            cursor,
            filter,
            flex,
            flexboxIE,
            flexboxOld,
            gradient,
            imageSet,
            position,
            sizing,
            transition,
        ],
        prefixMap: {
            transform: ['Webkit', 'ms'],
            transformOrigin: ['Webkit', 'ms'],
            transformOriginX: ['Webkit', 'ms'],
            transformOriginY: ['Webkit', 'ms'],
            backfaceVisibility: ['Webkit'],
            perspective: ['Webkit'],
            perspectiveOrigin: ['Webkit'],
            transformStyle: ['Webkit'],
            transformOriginZ: ['Webkit'],
            animation: ['Webkit'],
            animationDelay: ['Webkit'],
            animationDirection: ['Webkit'],
            animationFillMode: ['Webkit'],
            animationDuration: ['Webkit'],
            animationIterationCount: ['Webkit'],
            animationName: ['Webkit'],
            animationPlayState: ['Webkit'],
            animationTimingFunction: ['Webkit'],
            appearance: ['Webkit', 'Moz'],
            userSelect: ['Webkit', 'Moz', 'ms'],
            fontKerning: ['Webkit'],
            textEmphasisPosition: ['Webkit'],
            textEmphasis: ['Webkit'],
            textEmphasisStyle: ['Webkit'],
            textEmphasisColor: ['Webkit'],
            boxDecorationBreak: ['Webkit'],
            clipPath: ['Webkit'],
            maskImage: ['Webkit'],
            maskMode: ['Webkit'],
            maskRepeat: ['Webkit'],
            maskPosition: ['Webkit'],
            maskClip: ['Webkit'],
            maskOrigin: ['Webkit'],
            maskSize: ['Webkit'],
            maskComposite: ['Webkit'],
            mask: ['Webkit'],
            maskBorderSource: ['Webkit'],
            maskBorderMode: ['Webkit'],
            maskBorderSlice: ['Webkit'],
            maskBorderWidth: ['Webkit'],
            maskBorderOutset: ['Webkit'],
            maskBorderRepeat: ['Webkit'],
            maskBorder: ['Webkit'],
            maskType: ['Webkit'],
            textDecorationStyle: ['Webkit', 'Moz'],
            textDecorationSkip: ['Webkit', 'Moz'],
            textDecorationLine: ['Webkit', 'Moz'],
            textDecorationColor: ['Webkit', 'Moz'],
            filter: ['Webkit'],
            fontFeatureSettings: ['Webkit', 'Moz'],
            breakAfter: ['Webkit', 'Moz', 'ms'],
            breakBefore: ['Webkit', 'Moz', 'ms'],
            breakInside: ['Webkit', 'Moz', 'ms'],
            columnCount: ['Webkit', 'Moz'],
            columnFill: ['Webkit', 'Moz'],
            columnGap: ['Webkit', 'Moz'],
            columnRule: ['Webkit', 'Moz'],
            columnRuleColor: ['Webkit', 'Moz'],
            columnRuleStyle: ['Webkit', 'Moz'],
            columnRuleWidth: ['Webkit', 'Moz'],
            columns: ['Webkit', 'Moz'],
            columnSpan: ['Webkit', 'Moz'],
            columnWidth: ['Webkit', 'Moz'],
            flex: ['Webkit', 'ms'],
            flexBasis: ['Webkit'],
            flexDirection: ['Webkit', 'ms'],
            flexGrow: ['Webkit'],
            flexFlow: ['Webkit', 'ms'],
            flexShrink: ['Webkit'],
            flexWrap: ['Webkit', 'ms'],
            alignContent: ['Webkit'],
            alignItems: ['Webkit'],
            alignSelf: ['Webkit'],
            justifyContent: ['Webkit'],
            order: ['Webkit'],
            transitionDelay: ['Webkit'],
            transitionDuration: ['Webkit'],
            transitionProperty: ['Webkit'],
            transitionTimingFunction: ['Webkit'],
            backdropFilter: ['Webkit'],
            scrollSnapType: ['Webkit', 'ms'],
            scrollSnapPointsX: ['Webkit', 'ms'],
            scrollSnapPointsY: ['Webkit', 'ms'],
            scrollSnapDestination: ['Webkit', 'ms'],
            scrollSnapCoordinate: ['Webkit', 'ms'],
            shapeImageThreshold: ['Webkit'],
            shapeImageMargin: ['Webkit'],
            shapeImageOutside: ['Webkit'],
            hyphens: ['Webkit', 'Moz', 'ms'],
            flowInto: ['Webkit', 'ms'],
            flowFrom: ['Webkit', 'ms'],
            regionFragment: ['Webkit', 'ms'],
            boxSizing: ['Moz'],
            textAlignLast: ['Moz'],
            tabSize: ['Moz'],
            wrapFlow: ['ms'],
            wrapThrough: ['ms'],
            wrapMargin: ['ms'],
            touchAction: ['ms'],
            gridTemplateColumns: ['ms'],
            gridTemplateRows: ['ms'],
            gridTemplateAreas: ['ms'],
            gridTemplate: ['ms'],
            gridAutoColumns: ['ms'],
            gridAutoRows: ['ms'],
            gridAutoFlow: ['ms'],
            grid: ['ms'],
            gridRowStart: ['ms'],
            gridColumnStart: ['ms'],
            gridRowEnd: ['ms'],
            gridRow: ['ms'],
            gridColumn: ['ms'],
            gridColumnEnd: ['ms'],
            gridColumnGap: ['ms'],
            gridRowGap: ['ms'],
            gridArea: ['ms'],
            gridGap: ['ms'],
            textSizeAdjust: ['Webkit', 'ms'],
            borderImage: ['Webkit'],
            borderImageOutset: ['Webkit'],
            borderImageRepeat: ['Webkit'],
            borderImageSlice: ['Webkit'],
            borderImageSource: ['Webkit'],
            borderImageWidth: ['Webkit'],
        },
    }
if ('undefined' != typeof window) {
    let e,
        t = [],
        i = !1,
        n = 0,
        r = 1024,
        s = 'undefined' != typeof global ? global : self,
        o = s.MutationObserver || s.WebKitMutationObserver,
        a = function () {
            for (; n < t.length; ) {
                var e = n
                if (((n += 1), t[e].call(), n > r)) {
                    for (var s = 0, o = t.length - n; s < o; s++)
                        t[s] = t[s + n]
                    ;(t.length -= n), (n = 0)
                }
            }
            ;(t.length = 0), (n = 0), (i = !1)
        },
        l = function (e) {
            return function () {
                var t = setTimeout(n, 0),
                    i = setInterval(n, 50)
                function n() {
                    clearTimeout(t), clearInterval(i), e()
                }
            }
        }
    e =
        'function' == typeof o
            ? (function (e) {
                  var t = 1,
                      i = new o(e),
                      n = document.createTextNode('')
                  return (
                      i.observe(n, { characterData: !0 }),
                      function () {
                          ;(t = -t), (n.data = t)
                      }
                  )
              })(a)
            : l(a)
    let c = function (n) {
        t.length || (e(), (i = !0)), (t[t.length] = n)
    }
    ;(c.requestFlush = e), (c.makeRequestCallFromTimer = l)
    let f = [],
        m = [],
        u = function () {
            if (m.length) throw m.shift()
        },
        d = c.makeRequestCallFromTimer(u),
        p = function () {
            this.task = null
        }
    ;(p.prototype.call = function () {
        try {
            this.task.call()
        } catch (e) {
            asap.onerror ? asap.onerror(e) : (m.push(e), d())
        } finally {
            ;(this.task = null), (f[f.length] = this)
        }
    }),
        (asap = function (e) {
            var t
            ;((t = f.length ? f.pop() : new p()).task = e), c(t)
        })
} else {
    let e,
        t = 'function' == typeof setImmediate,
        i = [],
        n = !1,
        r = 0,
        s = 1024,
        o = function () {
            for (; r < i.length; ) {
                var e = r
                if (((r += 1), i[e].call(), r > s)) {
                    for (var t = 0, o = i.length - r; t < o; t++)
                        i[t] = i[t + r]
                    ;(i.length -= r), (r = 0)
                }
            }
            ;(i.length = 0), (r = 0), (n = !1)
        },
        a = function () {
            var i = process.domain
            i &&
                (e || (e = require('domain')),
                (e.active = process.domain = null)),
                n && t ? setImmediate(o) : process.nextTick(o),
                i && (e.active = process.domain = i)
        },
        l = function (e) {
            i.length || (a(), (n = !0)), (i[i.length] = e)
        }
    l.requestFlush = a
    let c = [],
        f = function () {
            ;(this.task = null), (this.domain = null)
        }
    ;(f.prototype.call = function () {
        this.domain && this.domain.enter()
        var e = !0
        try {
            this.task.call(), (e = !1), this.domain && this.domain.exit()
        } finally {
            e && l.requestFlush(),
                (this.task = null),
                (this.domain = null),
                c.push(this)
        }
    }),
        (asap = function (e) {
            var t
            ;((t = c.length ? c.pop() : new f()).task = e),
                (t.domain = process.domain),
                l(t)
        })
}
function stringHash(e) {
    for (var t = 5381, i = e.length; i; ) t = (33 * t) ^ e.charCodeAt(--i)
    return t >>> 0
}
const MAP_EXISTS = 'undefined' != typeof Map
class OrderedElements {
    constructor() {
        ;(this.elements = {}), (this.keyOrder = [])
    }
    forEach(e) {
        for (let t = 0; t < this.keyOrder.length; t++)
            e(this.elements[this.keyOrder[t]], this.keyOrder[t])
    }
    set(e, t, i) {
        if (this.elements.hasOwnProperty(e)) {
            if (i) {
                const t = this.keyOrder.indexOf(e)
                this.keyOrder.splice(t, 1), this.keyOrder.push(e)
            }
        } else this.keyOrder.push(e)
        if (null != t) {
            if (
                (MAP_EXISTS && t instanceof Map) ||
                t instanceof OrderedElements
            ) {
                const n = this.elements.hasOwnProperty(e)
                    ? this.elements[e]
                    : new OrderedElements()
                return (
                    t.forEach((e, t) => {
                        n.set(t, e, i)
                    }),
                    void (this.elements[e] = n)
                )
            }
            if (Array.isArray(t) || 'object' != typeof t) this.elements[e] = t
            else {
                const n = this.elements.hasOwnProperty(e)
                        ? this.elements[e]
                        : new OrderedElements(),
                    r = Object.keys(t)
                for (let e = 0; e < r.length; e += 1) n.set(r[e], t[r[e]], i)
                this.elements[e] = n
            }
        } else this.elements[e] = t
    }
    get(e) {
        return this.elements[e]
    }
    has(e) {
        return this.elements.hasOwnProperty(e)
    }
    addStyleType(e) {
        if ((MAP_EXISTS && e instanceof Map) || e instanceof OrderedElements)
            e.forEach((e, t) => {
                this.set(t, e, !0)
            })
        else {
            const t = Object.keys(e)
            for (let i = 0; i < t.length; i++) this.set(t[i], e[t[i]], !0)
        }
    }
}
export const mapObj = (e, t) => {
    const i = Object.keys(e),
        n = {}
    for (let r = 0; r < i.length; r += 1) {
        const [s, o] = t([i[r], e[i[r]]])
        n[s] = o
    }
    return n
}
const UPPERCASE_RE = /([A-Z])/g,
    UPPERCASE_RE_TO_KEBAB = (e) => `-${e.toLowerCase()}`
export const kebabifyStyleName = (e) => {
    const t = e.replace(UPPERCASE_RE, UPPERCASE_RE_TO_KEBAB)
    return 'm' === t[0] && 's' === t[1] && '-' === t[2] ? `-${t}` : t
}
const isUnitlessNumber = {
    animationIterationCount: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridRow: !0,
    gridColumn: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0,
}
function prefixKey(e, t) {
    return e + t.charAt(0).toUpperCase() + t.substring(1)
}
const prefixes = ['Webkit', 'ms', 'Moz', 'O']
Object.keys(isUnitlessNumber).forEach(function (e) {
    prefixes.forEach(function (t) {
        isUnitlessNumber[prefixKey(t, e)] = isUnitlessNumber[e]
    })
})
export const stringifyValue = (e, t) =>
    'number' == typeof t ? (isUnitlessNumber[e] ? '' + t : t + 'px') : '' + t
export const stringifyAndImportantifyValue = (e, t) =>
    importantify(stringifyValue(e, t))
export const hashString = (e) => stringHash(e).toString(36)
export const hashObject = (e) => hashString(JSON.stringify(e))
const importantify = (e) =>
    '!' === e[e.length - 10] && ' !important' === e.slice(-11)
        ? e
        : `${e} !important`
let styleTag = null
const injectStyleTag = (e) => {
        if (
            null == styleTag &&
            null == (styleTag = document.querySelector('style[data-aphrodite]'))
        ) {
            const e = document.head || document.getElementsByTagName('head')[0]
            ;((styleTag = document.createElement('style')).type = 'text/css'),
                styleTag.setAttribute('data-aphrodite', ''),
                e.appendChild(styleTag)
        }
        styleTag.styleSheet
            ? (styleTag.styleSheet.cssText += e)
            : styleTag.appendChild(document.createTextNode(e))
    },
    stringHandlers = {
        fontFamily: function e(t) {
            return Array.isArray(t)
                ? t.map(e).join(',')
                : 'object' == typeof t
                ? (injectStyleOnce(t.src, '@font-face', [t], !1),
                  `"${t.fontFamily}"`)
                : t
        },
        animationName: function e(t, i) {
            if (Array.isArray(t)) return t.map((t) => e(t, i)).join(',')
            if ('object' == typeof t) {
                const e = `keyframe_${hashObject(t)}`
                let n = `@keyframes ${e}{`
                return (
                    t instanceof OrderedElements
                        ? t.forEach((e, t) => {
                              n += generateCSS(t, [e], i, stringHandlers, !1)
                          })
                        : Object.keys(t).forEach((e) => {
                              n += generateCSS(e, [t[e]], i, stringHandlers, !1)
                          }),
                    injectGeneratedCSSOnce(e, (n += '}')),
                    e
                )
            }
            return t
        },
    }
let alreadyInjected = {},
    injectionBuffer = '',
    isBuffering = !1
const injectGeneratedCSSOnce = (e, t) => {
    if (!alreadyInjected[e]) {
        if (!isBuffering) {
            if ('undefined' == typeof document)
                throw new Error(
                    'Cannot automatically buffer without a document'
                )
            ;(isBuffering = !0), asap(flushToStyleTag)
        }
        ;(injectionBuffer += t), (alreadyInjected[e] = !0)
    }
}
export const injectStyleOnce = (e, t, i, n, r = []) => {
    if (alreadyInjected[e]) return
    const s = generateCSS(t, i, r, stringHandlers, n)
    injectGeneratedCSSOnce(e, s)
}
export const reset = () => {
    ;(injectionBuffer = ''),
        (alreadyInjected = {}),
        (isBuffering = !1),
        (styleTag = null)
}
export const startBuffering = () => {
    if (isBuffering) throw new Error('Cannot buffer while already buffering')
    isBuffering = !0
}
export const flushToString = () => {
    isBuffering = !1
    const e = injectionBuffer
    return (injectionBuffer = ''), e
}
export const flushToStyleTag = () => {
    const e = flushToString()
    e.length > 0 && injectStyleTag(e)
}
export const getRenderedClassNames = () => Object.keys(alreadyInjected)
export const addRenderedClassNames = (e) => {
    e.forEach((e) => {
        alreadyInjected[e] = !0
    })
}
const processStyleDefinitions = (e, t) => {
        for (let i = 0; i < e.length; i += 1)
            e[i] &&
                (Array.isArray(e[i])
                    ? processStyleDefinitions(e[i], t)
                    : (t.classNameBits.push(e[i]._name),
                      t.definitionBits.push(e[i]._definition)))
    },
    getStyleDefinitionsLengthHash = (e) =>
        (e.reduce((e, t) => e + (t ? t._len : 0), 0) % 36).toString(36)
export const injectAndGetClassName = (e, t, i) => {
    const n = { classNameBits: [], definitionBits: [] }
    if ((processStyleDefinitions(t, n), 0 === n.classNameBits.length)) return ''
    let r
    return (
        (r =
            'production' === process.env.NODE_ENV
                ? 1 === n.classNameBits.length
                    ? `_${n.classNameBits[0]}`
                    : `_${hashString(
                          n.classNameBits.join()
                      )}${getStyleDefinitionsLengthHash(t)}`
                : n.classNameBits.join('-o_O-')),
        injectStyleOnce(r, `.${r}`, n.definitionBits, e, i),
        r
    )
}
const prefixAll = createPrefixer(staticData)
export const defaultSelectorHandlers = [
    function (e, t, i) {
        return ':' !== e[0] ? null : i(t + e)
    },
    function (e, t, i) {
        if ('@' !== e[0]) return null
        return `${e}{${i(t)}}`
    },
]
export const generateCSS = (e, t, i, n, r) => {
    const s = new OrderedElements()
    for (let e = 0; e < t.length; e++) s.addStyleType(t[e])
    const o = new OrderedElements()
    let a = ''
    return (
        s.forEach((t, s) => {
            i.some((o) => {
                const l = o(s, e, (e) => generateCSS(e, [t], i, n, r))
                if (null != l) return (a += l), !0
            }) || o.set(s, t, !0)
        }),
        generateCSSRuleset(e, o, n, r, i) + a
    )
}
const runStringHandlers = (e, t, i) => {
        if (!t) return
        const n = Object.keys(t)
        for (let r = 0; r < n.length; r++) {
            const s = n[r]
            e.has(s) && e.set(s, t[s](e.get(s), i), !1)
        }
    },
    transformRule = (e, t, i) => `${kebabifyStyleName(e)}:${i(e, t)};`
export const generateCSSRuleset = (e, t, i, n, r) => {
    runStringHandlers(t, i, r)
    const s = { ...t.elements },
        o = prefixAll(t.elements),
        a = Object.keys(o)
    if (a.length !== t.keyOrder.length)
        for (let e = 0; e < a.length; e++) {
            let i
            if (!s.hasOwnProperty(a[e]))
                if (
                    (i =
                        'W' === a[e][0]
                            ? a[e][6].toLowerCase() + a[e].slice(7)
                            : 'o' === a[e][1]
                            ? a[e][3].toLowerCase() + a[e].slice(4)
                            : a[e][2].toLowerCase() + a[e].slice(3)) &&
                    s.hasOwnProperty(i)
                ) {
                    const n = t.keyOrder.indexOf(i)
                    t.keyOrder.splice(n, 0, a[e])
                } else t.keyOrder.unshift(a[e])
        }
    const l = !1 === n ? stringifyValue : stringifyAndImportantifyValue,
        c = []
    for (let e = 0; e < t.keyOrder.length; e++) {
        const i = t.keyOrder[e],
            n = o[i]
        if (Array.isArray(n))
            for (let e = 0; e < n.length; e++) c.push(transformRule(i, n[e], l))
        else c.push(transformRule(i, n, l))
    }
    return c.length ? `${e}{${c.join('')}}` : ''
}
const StyleSheet = {
        create: (e) =>
            mapObj(e, ([e, t]) => {
                const i = JSON.stringify(t)
                return [
                    e,
                    {
                        _len: i.length,
                        _name:
                            'production' === process.env.NODE_ENV
                                ? hashString(i)
                                : `${e}_${hashString(i)}`,
                        _definition: t,
                    },
                ]
            }),
        rehydrate(e = []) {
            e.forEach((e) => {
                alreadyInjected[e] = !0
            })
        },
    },
    StyleSheetServer = {
        renderStatic: (e) => (
            reset(),
            startBuffering(),
            {
                html: e(),
                css: {
                    content: flushToString(),
                    renderedClassNames: getRenderedClassNames(),
                },
            }
        ),
    },
    StyleSheetTestUtils = {
        suppressStyleInjection() {
            reset(), startBuffering()
        },
        clearBufferAndResumeStyleInjection() {
            reset()
        },
    },
    makeExports = (e, t) => ({
        StyleSheet: {
            ...StyleSheet,
            extend(i) {
                const n = i.map((e) => e.selectorHandler).filter((e) => e)
                return makeExports(e, t.concat(n))
            },
        },
        StyleSheetServer: StyleSheetServer,
        StyleSheetTestUtils: StyleSheetTestUtils,
        css: (...i) => injectAndGetClassName(e, i, t),
    }),
    useImportant = !1
let Aphro = makeExports(!1, defaultSelectorHandlers),
    AphroStyleSheet = Aphro.StyleSheet,
    AphroStyleSheetServer = Aphro.StyleSheetServer,
    AphroCss = Aphro.css
export {
    AphroStyleSheet as StyleSheet,
    AphroStyleSheetServer as StyleSheetServer,
    AphroCss as css,
}
export default Aphro
