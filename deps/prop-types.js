function createCommonjsModule(e, n) {
    return (n = { exports: {} }), e(n, n.exports), n.exports
}
function makeEmptyFunction(e) {
    return function () {
        return e
    }
}
function invariant(e, n, r, t, o, a, i, u) {
    if ((validateFormat(n), !e)) {
        var c
        if (void 0 === n)
            c = new Error(
                'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
            )
        else {
            var p = [r, t, o, a, i, u],
                s = 0
            ;(c = new Error(
                n.replace(/%s/g, function () {
                    return p[s++]
                })
            )).name = 'Invariant Violation'
        }
        throw ((c.framesToPop = 1), c)
    }
}
function toObject(e) {
    if (null === e || void 0 === e)
        throw new TypeError(
            'Object.assign cannot be called with null or undefined'
        )
    return Object(e)
}
function shouldUseNative() {
    try {
        if (!Object.assign) return !1
        var e = new String('abc')
        if (((e[5] = 'de'), '5' === Object.getOwnPropertyNames(e)[0])) return !1
        for (var n = {}, r = 0; r < 10; r++) n['_' + String.fromCharCode(r)] = r
        if (
            '0123456789' !==
            Object.getOwnPropertyNames(n)
                .map(function (e) {
                    return n[e]
                })
                .join('')
        )
            return !1
        var t = {}
        return (
            'abcdefghijklmnopqrst'.split('').forEach(function (e) {
                t[e] = e
            }),
            'abcdefghijklmnopqrst' ===
                Object.keys(Object.assign({}, t)).join('')
        )
    } catch (e) {
        return !1
    }
}
function checkPropTypes(e, n, r, t, o) {
    for (var a in e)
        if (e.hasOwnProperty(a)) {
            var i
            try {
                invariant$1(
                    'function' == typeof e[a],
                    '%s: %s type `%s` is invalid; it must be a function, usually from the `prop-types` package, but received `%s`.',
                    t || 'React class',
                    r,
                    a,
                    typeof e[a]
                ),
                    (i = e[a](n, a, t, r, null, ReactPropTypesSecret$1))
            } catch (e) {
                i = e
            }
            if (
                (warning$1(
                    !i || i instanceof Error,
                    '%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).',
                    t || 'React class',
                    r,
                    a,
                    typeof i
                ),
                i instanceof Error && !(i.message in loggedTypeFailures))
            ) {
                loggedTypeFailures[i.message] = !0
                var u = o ? o() : ''
                warning$1(
                    !1,
                    'Failed %s type: %s%s',
                    r,
                    i.message,
                    null != u ? u : ''
                )
            }
        }
}
var emptyFunction = function () {}
;(emptyFunction.thatReturns = makeEmptyFunction),
    (emptyFunction.thatReturnsFalse = makeEmptyFunction(!1)),
    (emptyFunction.thatReturnsTrue = makeEmptyFunction(!0)),
    (emptyFunction.thatReturnsNull = makeEmptyFunction(null)),
    (emptyFunction.thatReturnsThis = function () {
        return this
    }),
    (emptyFunction.thatReturnsArgument = function (e) {
        return e
    })
var emptyFunction_1 = emptyFunction,
    validateFormat = function (e) {}
validateFormat = function (e) {
    if (void 0 === e)
        throw new Error('invariant requires an error message argument')
}
var invariant_1 = invariant,
    warning = emptyFunction_1,
    printWarning = function (e) {
        for (
            var n = arguments.length, r = Array(n > 1 ? n - 1 : 0), t = 1;
            t < n;
            t++
        )
            r[t - 1] = arguments[t]
        var o = 0,
            a =
                'Warning: ' +
                e.replace(/%s/g, function () {
                    return r[o++]
                })
        'undefined' != typeof console && console.error(a)
        try {
            throw new Error(a)
        } catch (e) {}
    },
    warning_1 = (warning = function (e, n) {
        if (void 0 === n)
            throw new Error(
                '`warning(condition, format, ...args)` requires a warning message argument'
            )
        if (0 !== n.indexOf('Failed Composite propType: ') && !e) {
            for (
                var r = arguments.length, t = Array(r > 2 ? r - 2 : 0), o = 2;
                o < r;
                o++
            )
                t[o - 2] = arguments[o]
            printWarning.apply(void 0, [n].concat(t))
        }
    }),
    getOwnPropertySymbols = Object.getOwnPropertySymbols,
    hasOwnProperty = Object.prototype.hasOwnProperty,
    propIsEnumerable = Object.prototype.propertyIsEnumerable,
    objectAssign = shouldUseNative()
        ? Object.assign
        : function (e, n) {
              for (
                  var r, t, o = toObject(e), a = 1;
                  a < arguments.length;
                  a++
              ) {
                  r = Object(arguments[a])
                  for (var i in r) hasOwnProperty.call(r, i) && (o[i] = r[i])
                  if (getOwnPropertySymbols) {
                      t = getOwnPropertySymbols(r)
                      for (var u = 0; u < t.length; u++)
                          propIsEnumerable.call(r, t[u]) && (o[t[u]] = r[t[u]])
                  }
              }
              return o
          },
    ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED',
    ReactPropTypesSecret_1 = ReactPropTypesSecret,
    invariant$1 = invariant_1,
    warning$1 = warning_1,
    ReactPropTypesSecret$1 = ReactPropTypesSecret_1,
    loggedTypeFailures = {},
    checkPropTypes_1 = checkPropTypes,
    factoryWithTypeCheckers = function (e, n) {
        function r(e) {
            var n = e && ((y && e[y]) || e[d])
            if ('function' == typeof n) return n
        }
        function t(e, n) {
            return e === n ? 0 !== e || 1 / e == 1 / n : e !== e && n !== n
        }
        function o(e) {
            ;(this.message = e), (this.stack = '')
        }
        function a(e) {
            function r(r, i, u, c, p, s, f) {
                if (((c = c || m), (s = s || u), f !== ReactPropTypesSecret_1))
                    if (n)
                        invariant_1(
                            !1,
                            'Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types'
                        )
                    else if ('undefined' != typeof console) {
                        var l = c + ':' + u
                        !t[l] &&
                            a < 3 &&
                            (warning_1(
                                !1,
                                'You are manually calling a React.PropTypes validation function for the `%s` prop on `%s`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details.',
                                s,
                                c
                            ),
                            (t[l] = !0),
                            a++)
                    }
                return null == i[u]
                    ? r
                        ? new o(
                              null === i[u]
                                  ? 'The ' +
                                    p +
                                    ' `' +
                                    s +
                                    '` is marked as required in `' +
                                    c +
                                    '`, but its value is `null`.'
                                  : 'The ' +
                                    p +
                                    ' `' +
                                    s +
                                    '` is marked as required in `' +
                                    c +
                                    '`, but its value is `undefined`.'
                          )
                        : null
                    : e(i, u, c, p, s)
            }
            var t = {},
                a = 0,
                i = r.bind(null, !1)
            return (i.isRequired = r.bind(null, !0)), i
        }
        function i(e) {
            return a(function (n, r, t, a, i, u) {
                var c = n[r]
                return p(c) !== e
                    ? new o(
                          'Invalid ' +
                              a +
                              ' `' +
                              i +
                              '` of type `' +
                              s(c) +
                              '` supplied to `' +
                              t +
                              '`, expected `' +
                              e +
                              '`.'
                      )
                    : null
            })
        }
        function u(n) {
            switch (typeof n) {
                case 'number':
                case 'string':
                case 'undefined':
                    return !0
                case 'boolean':
                    return !n
                case 'object':
                    if (Array.isArray(n)) return n.every(u)
                    if (null === n || e(n)) return !0
                    var t = r(n)
                    if (!t) return !1
                    var o,
                        a = t.call(n)
                    if (t !== n.entries) {
                        for (; !(o = a.next()).done; )
                            if (!u(o.value)) return !1
                    } else
                        for (; !(o = a.next()).done; ) {
                            var i = o.value
                            if (i && !u(i[1])) return !1
                        }
                    return !0
                default:
                    return !1
            }
        }
        function c(e, n) {
            return (
                'symbol' === e ||
                'Symbol' === n['@@toStringTag'] ||
                ('function' == typeof Symbol && n instanceof Symbol)
            )
        }
        function p(e) {
            var n = typeof e
            return Array.isArray(e)
                ? 'array'
                : e instanceof RegExp
                ? 'object'
                : c(n, e)
                ? 'symbol'
                : n
        }
        function s(e) {
            if (void 0 === e || null === e) return '' + e
            var n = p(e)
            if ('object' === n) {
                if (e instanceof Date) return 'date'
                if (e instanceof RegExp) return 'regexp'
            }
            return n
        }
        function f(e) {
            var n = s(e)
            switch (n) {
                case 'array':
                case 'object':
                    return 'an ' + n
                case 'boolean':
                case 'date':
                case 'regexp':
                    return 'a ' + n
                default:
                    return n
            }
        }
        function l(e) {
            return e.constructor && e.constructor.name ? e.constructor.name : m
        }
        var y = 'function' == typeof Symbol && Symbol.iterator,
            d = '@@iterator',
            m = '<<anonymous>>',
            v = {
                array: i('array'),
                bool: i('boolean'),
                func: i('function'),
                number: i('number'),
                object: i('object'),
                string: i('string'),
                symbol: i('symbol'),
                any: a(emptyFunction_1.thatReturnsNull),
                arrayOf: function (e) {
                    return a(function (n, r, t, a, i) {
                        if ('function' != typeof e)
                            return new o(
                                'Property `' +
                                    i +
                                    '` of component `' +
                                    t +
                                    '` has invalid PropType notation inside arrayOf.'
                            )
                        var u = n[r]
                        if (!Array.isArray(u))
                            return new o(
                                'Invalid ' +
                                    a +
                                    ' `' +
                                    i +
                                    '` of type `' +
                                    p(u) +
                                    '` supplied to `' +
                                    t +
                                    '`, expected an array.'
                            )
                        for (var c = 0; c < u.length; c++) {
                            var s = e(
                                u,
                                c,
                                t,
                                a,
                                i + '[' + c + ']',
                                ReactPropTypesSecret_1
                            )
                            if (s instanceof Error) return s
                        }
                        return null
                    })
                },
                element: (function () {
                    return a(function (n, r, t, a, i) {
                        var u = n[r]
                        return e(u)
                            ? null
                            : new o(
                                  'Invalid ' +
                                      a +
                                      ' `' +
                                      i +
                                      '` of type `' +
                                      p(u) +
                                      '` supplied to `' +
                                      t +
                                      '`, expected a single ReactElement.'
                              )
                    })
                })(),
                instanceOf: function (e) {
                    return a(function (n, r, t, a, i) {
                        if (!(n[r] instanceof e)) {
                            var u = e.name || m
                            return new o(
                                'Invalid ' +
                                    a +
                                    ' `' +
                                    i +
                                    '` of type `' +
                                    l(n[r]) +
                                    '` supplied to `' +
                                    t +
                                    '`, expected instance of `' +
                                    u +
                                    '`.'
                            )
                        }
                        return null
                    })
                },
                node: (function () {
                    return a(function (e, n, r, t, a) {
                        return u(e[n])
                            ? null
                            : new o(
                                  'Invalid ' +
                                      t +
                                      ' `' +
                                      a +
                                      '` supplied to `' +
                                      r +
                                      '`, expected a ReactNode.'
                              )
                    })
                })(),
                objectOf: function (e) {
                    return a(function (n, r, t, a, i) {
                        if ('function' != typeof e)
                            return new o(
                                'Property `' +
                                    i +
                                    '` of component `' +
                                    t +
                                    '` has invalid PropType notation inside objectOf.'
                            )
                        var u = n[r],
                            c = p(u)
                        if ('object' !== c)
                            return new o(
                                'Invalid ' +
                                    a +
                                    ' `' +
                                    i +
                                    '` of type `' +
                                    c +
                                    '` supplied to `' +
                                    t +
                                    '`, expected an object.'
                            )
                        for (var s in u)
                            if (u.hasOwnProperty(s)) {
                                var f = e(
                                    u,
                                    s,
                                    t,
                                    a,
                                    i + '.' + s,
                                    ReactPropTypesSecret_1
                                )
                                if (f instanceof Error) return f
                            }
                        return null
                    })
                },
                oneOf: function (e) {
                    return Array.isArray(e)
                        ? a(function (n, r, a, i, u) {
                              for (var c = n[r], p = 0; p < e.length; p++)
                                  if (t(c, e[p])) return null
                              return new o(
                                  'Invalid ' +
                                      i +
                                      ' `' +
                                      u +
                                      '` of value `' +
                                      c +
                                      '` supplied to `' +
                                      a +
                                      '`, expected one of ' +
                                      JSON.stringify(e) +
                                      '.'
                              )
                          })
                        : (warning_1(
                              !1,
                              'Invalid argument supplied to oneOf, expected an instance of array.'
                          ),
                          emptyFunction_1.thatReturnsNull)
                },
                oneOfType: function (e) {
                    if (!Array.isArray(e))
                        return (
                            warning_1(
                                !1,
                                'Invalid argument supplied to oneOfType, expected an instance of array.'
                            ),
                            emptyFunction_1.thatReturnsNull
                        )
                    for (var n = 0; n < e.length; n++) {
                        var r = e[n]
                        if ('function' != typeof r)
                            return (
                                warning_1(
                                    !1,
                                    'Invalid argument supplied to oneOfType. Expected an array of check functions, but received %s at index %s.',
                                    f(r),
                                    n
                                ),
                                emptyFunction_1.thatReturnsNull
                            )
                    }
                    return a(function (n, r, t, a, i) {
                        for (var u = 0; u < e.length; u++)
                            if (
                                null ==
                                (0, e[u])(n, r, t, a, i, ReactPropTypesSecret_1)
                            )
                                return null
                        return new o(
                            'Invalid ' +
                                a +
                                ' `' +
                                i +
                                '` supplied to `' +
                                t +
                                '`.'
                        )
                    })
                },
                shape: function (e) {
                    return a(function (n, r, t, a, i) {
                        var u = n[r],
                            c = p(u)
                        if ('object' !== c)
                            return new o(
                                'Invalid ' +
                                    a +
                                    ' `' +
                                    i +
                                    '` of type `' +
                                    c +
                                    '` supplied to `' +
                                    t +
                                    '`, expected `object`.'
                            )
                        for (var s in e) {
                            var f = e[s]
                            if (f) {
                                var l = f(
                                    u,
                                    s,
                                    t,
                                    a,
                                    i + '.' + s,
                                    ReactPropTypesSecret_1
                                )
                                if (l) return l
                            }
                        }
                        return null
                    })
                },
                exact: function (e) {
                    return a(function (n, r, t, a, i) {
                        var u = n[r],
                            c = p(u)
                        if ('object' !== c)
                            return new o(
                                'Invalid ' +
                                    a +
                                    ' `' +
                                    i +
                                    '` of type `' +
                                    c +
                                    '` supplied to `' +
                                    t +
                                    '`, expected `object`.'
                            )
                        var s = objectAssign({}, n[r], e)
                        for (var f in s) {
                            var l = e[f]
                            if (!l)
                                return new o(
                                    'Invalid ' +
                                        a +
                                        ' `' +
                                        i +
                                        '` key `' +
                                        f +
                                        '` supplied to `' +
                                        t +
                                        '`.\nBad object: ' +
                                        JSON.stringify(n[r], null, '  ') +
                                        '\nValid keys: ' +
                                        JSON.stringify(
                                            Object.keys(e),
                                            null,
                                            '  '
                                        )
                                )
                            var y = l(
                                u,
                                f,
                                t,
                                a,
                                i + '.' + f,
                                ReactPropTypesSecret_1
                            )
                            if (y) return y
                        }
                        return null
                    })
                },
            }
        return (
            (o.prototype = Error.prototype),
            (v.checkPropTypes = checkPropTypes_1),
            (v.PropTypes = v),
            v
        )
    },
    propTypes = createCommonjsModule(function (e) {
        var n =
                ('function' == typeof Symbol &&
                    Symbol.for &&
                    Symbol.for('react.element')) ||
                60103,
            r = function (e) {
                return 'object' == typeof e && null !== e && e.$$typeof === n
            }
        e.exports = factoryWithTypeCheckers(r, !0)
    })
let node = propTypes.node
export { node }
export default propTypes
