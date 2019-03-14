import { createStore, applyMiddleware, compose } from '/redux.js'
import thunk from '/redux-thunk.js'

import rootReducer from '/modules/main/rootReducer.js'

export default function configureStore(initialState, routerMiddleware) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, routerMiddleware)
    )
}
