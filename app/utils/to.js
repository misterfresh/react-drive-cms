const nativeExceptions = [
    EvalError,
    RangeError,
    ReferenceError,
    SyntaxError,
    TypeError,
    URIError,
].filter((except) => typeof except === 'function')

/* Throw native errors. ref: https://bit.ly/2VsoCGE */
function throwNative(error) {
    for (const Exception of nativeExceptions) {
        if (error instanceof Exception) throw error
    }
}

/* Helper buddy for removing async/await try/catch litter */
export const to = function (promise, finallyFunc) {
    return promise
        .then((data) => {
            if (data instanceof Error) {
                throwNative(data)
                return [data]
            }
            return [undefined, data]
        })
        .catch((error) => {
            throwNative(error)
            return [error]
        })
        .finally(() => {
            if (finallyFunc && typeof finallyFunc === 'function') {
                finallyFunc()
            }
        })
}
