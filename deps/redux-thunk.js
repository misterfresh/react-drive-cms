function createThunkMiddleware(t) {
    return ({ dispatch: e, getState: n }) => (r) => (u) =>
        'function' == typeof u ? u(e, n, t) : r(u)
}
const thunk = createThunkMiddleware()
thunk.withExtraArgument = createThunkMiddleware
export default thunk
