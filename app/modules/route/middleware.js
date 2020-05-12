import { CALL_HISTORY_METHOD } from './actionTypes.js'

/**
 * This middleware captures CALL_HISTORY_METHOD actions to redirect to the
 * provided history object. This will prevent these actions from reaching your
 * reducer or any middleware that comes after this one.
 */
export default function routerMiddleware(history) {
    return () => (next) => (action) => {
        if (action.type !== CALL_HISTORY_METHOD) {
            return next(action)
        }
        const {
            location: { method, args },
        } = action
        history[method](...args)
    }
}
