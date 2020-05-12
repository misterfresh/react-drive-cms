function isObject(t) {
    var e = typeof t
    return null != t && ('object' == e || 'function' == e)
}
function isObjectLike(t) {
    return null != t && 'object' == typeof t
}
function objectToString(t) {
    return nativeObjectToString.call(t)
}
function getRawTag(t) {
    var e = hasOwnProperty.call(t, symToStringTag),
        n = t[symToStringTag]
    try {
        t[symToStringTag] = void 0
        var o = !0
    } catch (t) {}
    var r = nativeObjectToString.call(t)
    return o && (e ? (t[symToStringTag] = n) : delete t[symToStringTag]), r
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
function isSymbol(t) {
    return (
        'symbol' == typeof t || (isObjectLike(t) && baseGetTag(t) == symbolTag)
    )
}
function toNumber(t) {
    if ('number' == typeof t) return t
    if (isSymbol(t)) return NAN
    if (isObject(t)) {
        var e = 'function' == typeof t.valueOf ? t.valueOf() : t
        t = isObject(e) ? e + '' : e
    }
    if ('string' != typeof t) return 0 === t ? t : +t
    t = t.replace(reTrim, '')
    var n = reIsBinary.test(t)
    return n || reIsOctal.test(t)
        ? freeParseInt(t.slice(2), n ? 2 : 8)
        : reIsBadHex.test(t)
        ? NAN
        : +t
}
function debounce(t, e, n) {
    function o(e) {
        var n = f,
            o = b
        return (f = b = void 0), (m = e), (g = t.apply(o, n))
    }
    function r(t) {
        return (m = t), (T = setTimeout(u, e)), v ? o(t) : g
    }
    function i(t) {
        var n = t - m,
            o = e - (t - y)
        return j ? nativeMin(o, s - n) : o
    }
    function a(t) {
        var n = t - y,
            o = t - m
        return void 0 === y || n >= e || n < 0 || (j && o >= s)
    }
    function u() {
        var t = now()
        if (a(t)) return c(t)
        T = setTimeout(u, i(t))
    }
    function c(t) {
        return (T = void 0), S && f ? o(t) : ((f = b = void 0), g)
    }
    function l() {
        var t = now(),
            n = a(t)
        if (((f = arguments), (b = this), (y = t), n)) {
            if (void 0 === T) return r(y)
            if (j) return (T = setTimeout(u, e)), o(y)
        }
        return void 0 === T && (T = setTimeout(u, e)), g
    }
    var f,
        b,
        s,
        g,
        T,
        y,
        m = 0,
        v = !1,
        j = !1,
        S = !0
    if ('function' != typeof t) throw new TypeError(FUNC_ERROR_TEXT)
    return (
        (e = toNumber(e) || 0),
        isObject(n) &&
            ((v = !!n.leading),
            (s = (j = 'maxWait' in n)
                ? nativeMax(toNumber(n.maxWait) || 0, e)
                : s),
            (S = 'trailing' in n ? !!n.trailing : S)),
        (l.cancel = function () {
            void 0 !== T && clearTimeout(T), (m = 0), (f = y = b = T = void 0)
        }),
        (l.flush = function () {
            return void 0 === T ? g : c(now())
        }),
        l
    )
}
var objectProto = Object.prototype,
    nativeObjectToString = objectProto.toString,
    freeGlobal =
        'object' == typeof global &&
        global &&
        global.Object === Object &&
        global,
    freeSelf =
        'object' == typeof self && self && self.Object === Object && self,
    root = freeGlobal || freeSelf || Function('return this')(),
    Symbol = root.Symbol,
    hasOwnProperty = (objectProto = Object.prototype).hasOwnProperty,
    nativeObjectToString = objectProto.toString,
    symToStringTag = Symbol ? Symbol.toStringTag : void 0,
    now = function () {
        return root.Date.now()
    },
    nullTag = '[object Null]',
    undefinedTag = '[object Undefined]',
    symToStringTag = Symbol ? Symbol.toStringTag : void 0,
    symbolTag = '[object Symbol]',
    NAN = NaN,
    reTrim = /^\s+|\s+$/g,
    reIsBadHex = /^[-+]0x[0-9a-f]+$/i,
    reIsBinary = /^0b[01]+$/i,
    reIsOctal = /^0o[0-7]+$/i,
    freeParseInt = parseInt,
    FUNC_ERROR_TEXT = 'Expected a function',
    nativeMax = Math.max,
    nativeMin = Math.min
export default debounce
