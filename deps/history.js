function valueEqual(t, e) {
    if (t === e) return !0
    if (null == t || null == e) return !1
    if (Array.isArray(t))
        return (
            Array.isArray(e) &&
            t.length === e.length &&
            t.every(function (t, n) {
                return valueEqual(t, e[n])
            })
        )
    const n = typeof t
    if (n !== typeof e) return !1
    if ('object' === n) {
        const n = t.valueOf(),
            a = e.valueOf()
        if (n !== t || a !== e) return valueEqual(n, a)
        const o = Object.keys(t),
            r = Object.keys(e)
        return (
            o.length === r.length &&
            o.every(function (n) {
                return valueEqual(t[n], e[n])
            })
        )
    }
    return !1
}
function isAbsolute(t) {
    return '/' === t.charAt(0)
}
function spliceOne(t, e) {
    for (let n = e, a = n + 1, o = t.length; a < o; n += 1, a += 1) t[n] = t[a]
    t.pop()
}
function resolvePathname(t, e = '') {
    const n = (t && t.split('/')) || []
    let a = (e && e.split('/')) || []
    const o = t && isAbsolute(t),
        r = e && isAbsolute(e),
        i = o || r
    if (
        (t && isAbsolute(t)
            ? (a = n)
            : n.length && (a.pop(), (a = a.concat(n))),
        !a.length)
    )
        return '/'
    let s
    if (a.length) {
        const t = a[a.length - 1]
        s = '.' === t || '..' === t || '' === t
    } else s = !1
    let c = 0
    for (let t = a.length; t >= 0; t--) {
        const e = a[t]
        '.' === e
            ? spliceOne(a, t)
            : '..' === e
            ? (spliceOne(a, t), c++)
            : c && (spliceOne(a, t), c--)
    }
    if (!i) for (; c--; c) a.unshift('..')
    !i || '' === a[0] || (a[0] && isAbsolute(a[0])) || a.unshift('')
    let h = a.join('/')
    return s && '/' !== h.substr(-1) && (h += '/'), h
}
const warning = function (t, e, n) {
        var a = arguments.length
        n = new Array(a > 2 ? a - 2 : 0)
        for (var o = 2; o < a; o++) n[o - 2] = arguments[o]
        if (void 0 === e)
            throw new Error(
                '`warning(condition, format, ...args)` requires a warning message argument'
            )
        if (e.length < 10 || /^[s\W]*$/.test(e))
            throw new Error(
                'The warning format should be able to uniquely identify this warning. Please, use a more descriptive format than: ' +
                    e
            )
        if (!t) {
            var r = 0,
                i =
                    'Warning: ' +
                    e.replace(/%s/g, function () {
                        return n[r++]
                    })
            'undefined' != typeof console && console.error(i)
            try {
                throw new Error(i)
            } catch (t) {}
        }
    },
    invariant = function (t, e, n, a, o, r, i, s) {
        if (void 0 === e)
            throw new Error('invariant requires an error message argument')
        if (!t) {
            var c
            if (void 0 === e)
                c = new Error(
                    'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
                )
            else {
                var h = [n, a, o, r, i, s],
                    l = 0
                ;(c = new Error(
                    e.replace(/%s/g, function () {
                        return h[l++]
                    })
                )).name = 'Invariant Violation'
            }
            throw ((c.framesToPop = 1), c)
        }
    }
export const canUseDOM = !(
    'undefined' == typeof window ||
    !window.document ||
    !window.document.createElement
)
export const addEventListener = (t, e, n) =>
    t.addEventListener
        ? t.addEventListener(e, n, !1)
        : t.attachEvent('on' + e, n)
export const removeEventListener = (t, e, n) =>
    t.removeEventListener
        ? t.removeEventListener(e, n, !1)
        : t.detachEvent('on' + e, n)
export const getConfirmation = (t, e) => e(window.confirm(t))
export const supportsHistory = () => {
    const t = window.navigator.userAgent
    return (
        ((-1 === t.indexOf('Android 2.') && -1 === t.indexOf('Android 4.0')) ||
            -1 === t.indexOf('Mobile Safari') ||
            -1 !== t.indexOf('Chrome') ||
            -1 !== t.indexOf('Windows Phone')) &&
        window.history &&
        'pushState' in window.history
    )
}
export const supportsPopStateOnHashChange = () =>
    -1 === window.navigator.userAgent.indexOf('Trident')
export const supportsGoWithoutReloadUsingHash = () =>
    -1 === window.navigator.userAgent.indexOf('Firefox')
export const isExtraneousPopstateEvent = (t) =>
    void 0 === t.state && -1 === navigator.userAgent.indexOf('CriOS')
export const addLeadingSlash = (t) => ('/' === t.charAt(0) ? t : '/' + t)
export const stripLeadingSlash = (t) => ('/' === t.charAt(0) ? t.substr(1) : t)
export const hasBasename = (t, e) =>
    new RegExp('^' + e + '(\\/|\\?|#|$)', 'i').test(t)
export const stripBasename = (t, e) =>
    hasBasename(t, e) ? t.substr(e.length) : t
export const stripTrailingSlash = (t) =>
    '/' === t.charAt(t.length - 1) ? t.slice(0, -1) : t
export const parsePath = (t) => {
    let e = t || '/',
        n = '',
        a = ''
    const o = e.indexOf('#')
    ;-1 !== o && ((a = e.substr(o)), (e = e.substr(0, o)))
    const r = e.indexOf('?')
    return (
        -1 !== r && ((n = e.substr(r)), (e = e.substr(0, r))),
        { pathname: e, search: '?' === n ? '' : n, hash: '#' === a ? '' : a }
    )
}
export const createPath = (t) => {
    const { pathname: e, search: n, hash: a } = t
    let o = e || '/'
    return (
        n && '?' !== n && (o += '?' === n.charAt(0) ? n : `?${n}`),
        a && '#' !== a && (o += '#' === a.charAt(0) ? a : `#${a}`),
        o
    )
}
export const createLocation = (t, e, n, a) => {
    let o
    'string' == typeof t
        ? ((o = parsePath(t)).state = e)
        : (void 0 === (o = { ...t }).pathname && (o.pathname = ''),
          o.search
              ? '?' !== o.search.charAt(0) && (o.search = '?' + o.search)
              : (o.search = ''),
          o.hash
              ? '#' !== o.hash.charAt(0) && (o.hash = '#' + o.hash)
              : (o.hash = ''),
          void 0 !== e && void 0 === o.state && (o.state = e))
    try {
        o.pathname = decodeURI(o.pathname)
    } catch (t) {
        throw t instanceof URIError
            ? new URIError(
                  'Pathname "' +
                      o.pathname +
                      '" could not be decoded. This is likely caused by an invalid percent-encoding.'
              )
            : t
    }
    return (
        n && (o.key = n),
        a
            ? o.pathname
                ? '/' !== o.pathname.charAt(0) &&
                  (o.pathname = resolvePathname(o.pathname, a.pathname))
                : (o.pathname = a.pathname)
            : o.pathname || (o.pathname = '/'),
        o
    )
}
export const locationsAreEqual = (t, e) =>
    t.pathname === e.pathname &&
    t.search === e.search &&
    t.hash === e.hash &&
    t.key === e.key &&
    valueEqual(t.state, e.state)
const createTransitionManager = () => {
        let t = null
        let e = []
        return {
            setPrompt: (e) => (
                warning(
                    null == t,
                    'A history supports only one prompt at a time'
                ),
                (t = e),
                () => {
                    t === e && (t = null)
                }
            ),
            confirmTransitionTo: (e, n, a, o) => {
                if (null != t) {
                    const r = 'function' == typeof t ? t(e, n) : t
                    'string' == typeof r
                        ? 'function' == typeof a
                            ? a(r, o)
                            : (warning(
                                  !1,
                                  'A history needs a getUserConfirmation function in order to use a prompt message'
                              ),
                              o(!0))
                        : o(!1 !== r)
                } else o(!0)
            },
            appendListener: (t) => {
                let n = !0
                const a = (...e) => {
                    n && t(...e)
                }
                return (
                    e.push(a),
                    () => {
                        ;(n = !1), (e = e.filter((t) => t !== a))
                    }
                )
            },
            notifyListeners: (...t) => {
                e.forEach((e) => e(...t))
            },
        }
    },
    PopStateEvent = 'popstate',
    HashChangeEvent = 'hashchange',
    getHistoryState = () => {
        try {
            return window.history.state || {}
        } catch (t) {
            return {}
        }
    }
export const createBrowserHistory = (t = {}) => {
    invariant(canUseDOM, 'Browser history needs a DOM')
    const e = window.history,
        n = supportsHistory(),
        a = !supportsPopStateOnHashChange(),
        {
            forceRefresh: o = !1,
            getUserConfirmation: r = getConfirmation,
            keyLength: i = 6,
        } = t,
        s = t.basename ? stripTrailingSlash(addLeadingSlash(t.basename)) : '',
        c = (t) => {
            const { key: e, state: n } = t || {},
                { pathname: a, search: o, hash: r } = window.location
            let i = a + o + r
            return (
                warning(
                    !s || hasBasename(i, s),
                    'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "' +
                        i +
                        '" to begin with "' +
                        s +
                        '".'
                ),
                s && (i = stripBasename(i, s)),
                createLocation(i, n, e)
            )
        },
        h = () => Math.random().toString(36).substr(2, i),
        l = createTransitionManager(),
        d = (t) => {
            Object.assign(L, t),
                (L.length = e.length),
                l.notifyListeners(L.location, L.action)
        },
        p = (t) => {
            isExtraneousPopstateEvent(t) || f(c(t.state))
        },
        u = () => {
            f(c(getHistoryState()))
        }
    let g = !1
    const f = (t) => {
            if (g) (g = !1), d()
            else {
                l.confirmTransitionTo(t, 'POP', r, (e) => {
                    e ? d({ action: 'POP', location: t }) : w(t)
                })
            }
        },
        w = (t) => {
            const e = L.location
            let n = v.indexOf(e.key)
            ;-1 === n && (n = 0)
            let a = v.indexOf(t.key)
            ;-1 === a && (a = 0)
            const o = n - a
            o && ((g = !0), P(o))
        },
        m = c(getHistoryState())
    let v = [m.key]
    const y = (t) => s + createPath(t),
        P = (t) => {
            e.go(t)
        }
    let x = 0
    const b = (t) => {
        1 === (x += t)
            ? (addEventListener(window, 'popstate', p),
              a && addEventListener(window, 'hashchange', u))
            : 0 === x &&
              (removeEventListener(window, 'popstate', p),
              a && removeEventListener(window, 'hashchange', u))
    }
    let E = !1
    const L = {
        length: e.length,
        action: 'POP',
        location: m,
        createHref: y,
        push: (t, a) => {
            warning(
                !('object' == typeof t && void 0 !== t.state && void 0 !== a),
                'You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored'
            )
            const i = createLocation(t, a, h(), L.location)
            l.confirmTransitionTo(i, 'PUSH', r, (t) => {
                if (!t) return
                const a = y(i),
                    { key: r, state: s } = i
                if (n)
                    if ((e.pushState({ key: r, state: s }, null, a), o))
                        window.location.href = a
                    else {
                        const t = v.indexOf(L.location.key),
                            e = v.slice(0, -1 === t ? 0 : t + 1)
                        e.push(i.key),
                            (v = e),
                            d({ action: 'PUSH', location: i })
                    }
                else
                    warning(
                        void 0 === s,
                        'Browser history cannot push state in browsers that do not support HTML5 history'
                    ),
                        (window.location.href = a)
            })
        },
        replace: (t, a) => {
            warning(
                !('object' == typeof t && void 0 !== t.state && void 0 !== a),
                'You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored'
            )
            const i = createLocation(t, a, h(), L.location)
            l.confirmTransitionTo(i, 'REPLACE', r, (t) => {
                if (!t) return
                const a = y(i),
                    { key: r, state: s } = i
                if (n)
                    if ((e.replaceState({ key: r, state: s }, null, a), o))
                        window.location.replace(a)
                    else {
                        const t = v.indexOf(L.location.key)
                        ;-1 !== t && (v[t] = i.key),
                            d({ action: 'REPLACE', location: i })
                    }
                else
                    warning(
                        void 0 === s,
                        'Browser history cannot replace state in browsers that do not support HTML5 history'
                    ),
                        window.location.replace(a)
            })
        },
        go: P,
        goBack: () => P(-1),
        goForward: () => P(1),
        block: (t = !1) => {
            const e = l.setPrompt(t)
            return E || (b(1), (E = !0)), () => (E && ((E = !1), b(-1)), e())
        },
        listen: (t) => {
            const e = l.appendListener(t)
            return (
                b(1),
                () => {
                    b(-1), e()
                }
            )
        },
    }
    return L
}
const HashPathCoders = {
        hashbang: {
            encodePath: (t) =>
                '!' === t.charAt(0) ? t : '!/' + stripLeadingSlash(t),
            decodePath: (t) => ('!' === t.charAt(0) ? t.substr(1) : t),
        },
        noslash: { encodePath: stripLeadingSlash, decodePath: addLeadingSlash },
        slash: { encodePath: addLeadingSlash, decodePath: addLeadingSlash },
    },
    getHashPath = () => {
        const t = window.location.href,
            e = t.indexOf('#')
        return -1 === e ? '' : t.substring(e + 1)
    },
    pushHashPath = (t) => (window.location.hash = t),
    replaceHashPath = (t) => {
        const e = window.location.href.indexOf('#')
        window.location.replace(
            window.location.href.slice(0, e >= 0 ? e : 0) + '#' + t
        )
    }
export const createHashHistory = (t = {}) => {
    invariant(canUseDOM, 'Hash history needs a DOM')
    const e = window.history,
        n = supportsGoWithoutReloadUsingHash(),
        { getUserConfirmation: a = getConfirmation, hashType: o = 'slash' } = t,
        r = t.basename ? stripTrailingSlash(addLeadingSlash(t.basename)) : '',
        { encodePath: i, decodePath: s } = HashPathCoders[o],
        c = () => {
            let t = s(getHashPath())
            return (
                warning(
                    !r || hasBasename(t, r),
                    'You are attempting to use a basename on a page whose URL path does not begin with the basename. Expected path "' +
                        t +
                        '" to begin with "' +
                        r +
                        '".'
                ),
                r && (t = stripBasename(t, r)),
                createLocation(t)
            )
        },
        h = createTransitionManager(),
        l = (t) => {
            Object.assign(L, t),
                (L.length = e.length),
                h.notifyListeners(L.location, L.action)
        }
    let d = !1,
        p = null
    const u = () => {
            const t = getHashPath(),
                e = i(t)
            if (t !== e) replaceHashPath(e)
            else {
                const t = c(),
                    e = L.location
                if (!d && locationsAreEqual(e, t)) return
                if (p === createPath(t)) return
                ;(p = null), g(t)
            }
        },
        g = (t) => {
            if (d) (d = !1), l()
            else {
                h.confirmTransitionTo(t, 'POP', a, (e) => {
                    e ? l({ action: 'POP', location: t }) : f(t)
                })
            }
        },
        f = (t) => {
            const e = L.location
            let n = y.lastIndexOf(createPath(e))
            ;-1 === n && (n = 0)
            let a = y.lastIndexOf(createPath(t))
            ;-1 === a && (a = 0)
            const o = n - a
            o && ((d = !0), P(o))
        },
        w = getHashPath(),
        m = i(w)
    w !== m && replaceHashPath(m)
    const v = c()
    let y = [createPath(v)]
    const P = (t) => {
        warning(
            n,
            'Hash history go(n) causes a full page reload in this browser'
        ),
            e.go(t)
    }
    let x = 0
    const b = (t) => {
        1 === (x += t)
            ? addEventListener(window, 'hashchange', u)
            : 0 === x && removeEventListener(window, 'hashchange', u)
    }
    let E = !1
    const L = {
        length: e.length,
        action: 'POP',
        location: v,
        createHref: (t) => '#' + i(r + createPath(t)),
        push: (t, e) => {
            warning(
                void 0 === e,
                'Hash history cannot push state; it is ignored'
            )
            const n = createLocation(t, void 0, void 0, L.location)
            h.confirmTransitionTo(n, 'PUSH', a, (t) => {
                if (!t) return
                const e = createPath(n),
                    a = i(r + e)
                if (getHashPath() !== a) {
                    ;(p = e), pushHashPath(a)
                    const t = y.lastIndexOf(createPath(L.location)),
                        o = y.slice(0, -1 === t ? 0 : t + 1)
                    o.push(e), (y = o), l({ action: 'PUSH', location: n })
                } else
                    warning(
                        !1,
                        'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
                    ),
                        l()
            })
        },
        replace: (t, e) => {
            warning(
                void 0 === e,
                'Hash history cannot replace state; it is ignored'
            )
            const n = createLocation(t, void 0, void 0, L.location)
            h.confirmTransitionTo(n, 'REPLACE', a, (t) => {
                if (!t) return
                const e = createPath(n),
                    a = i(r + e)
                getHashPath() !== a && ((p = e), replaceHashPath(a))
                const o = y.indexOf(createPath(L.location))
                ;-1 !== o && (y[o] = e), l({ action: 'REPLACE', location: n })
            })
        },
        go: P,
        goBack: () => P(-1),
        goForward: () => P(1),
        block: (t = !1) => {
            const e = h.setPrompt(t)
            return E || (b(1), (E = !0)), () => (E && ((E = !1), b(-1)), e())
        },
        listen: (t) => {
            const e = h.appendListener(t)
            return (
                b(1),
                () => {
                    b(-1), e()
                }
            )
        },
    }
    return L
}
const clamp = (t, e, n) => Math.min(Math.max(t, e), n)
export const createMemoryHistory = (t = {}) => {
    const {
            getUserConfirmation: e,
            initialEntries: n = ['/'],
            initialIndex: a = 0,
            keyLength: o = 6,
        } = t,
        r = createTransitionManager(),
        i = (t) => {
            Object.assign(p, t),
                (p.length = p.entries.length),
                r.notifyListeners(p.location, p.action)
        },
        s = () => Math.random().toString(36).substr(2, o),
        c = clamp(a, 0, n.length - 1),
        h = n.map((t) =>
            'string' == typeof t
                ? createLocation(t, void 0, s())
                : createLocation(t, void 0, t.key || s())
        ),
        l = createPath,
        d = (t) => {
            const n = clamp(p.index + t, 0, p.entries.length - 1),
                a = p.entries[n]
            r.confirmTransitionTo(a, 'POP', e, (t) => {
                t ? i({ action: 'POP', location: a, index: n }) : i()
            })
        },
        p = {
            length: h.length,
            action: 'POP',
            location: h[c],
            index: c,
            entries: h,
            createHref: l,
            push: (t, n) => {
                warning(
                    !(
                        'object' == typeof t &&
                        void 0 !== t.state &&
                        void 0 !== n
                    ),
                    'You should avoid providing a 2nd state argument to push when the 1st argument is a location-like object that already has state; it is ignored'
                )
                const a = createLocation(t, n, s(), p.location)
                r.confirmTransitionTo(a, 'PUSH', e, (t) => {
                    if (!t) return
                    const e = p.index + 1,
                        n = p.entries.slice(0)
                    n.length > e ? n.splice(e, n.length - e, a) : n.push(a),
                        i({ action: 'PUSH', location: a, index: e, entries: n })
                })
            },
            replace: (t, n) => {
                warning(
                    !(
                        'object' == typeof t &&
                        void 0 !== t.state &&
                        void 0 !== n
                    ),
                    'You should avoid providing a 2nd state argument to replace when the 1st argument is a location-like object that already has state; it is ignored'
                )
                const a = createLocation(t, n, s(), p.location)
                r.confirmTransitionTo(a, 'REPLACE', e, (t) => {
                    t &&
                        ((p.entries[p.index] = a),
                        i({ action: 'REPLACE', location: a }))
                })
            },
            go: d,
            goBack: () => d(-1),
            goForward: () => d(1),
            canGo: (t) => {
                const e = p.index + t
                return e >= 0 && e < p.entries.length
            },
            block: (t = !1) => r.setPrompt(t),
            listen: (t) => r.appendListener(t),
        }
    return p
}
