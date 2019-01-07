import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

import rootReducer from 'main/rootReducer'

export default function configureStore(initialState, routerMiddleware) {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, routerMiddleware)
    )
}
