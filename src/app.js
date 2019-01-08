import React from 'react'
import { render } from 'react'

import { createBrowserHistory } from 'history'
import { StyleSheet } from 'aphrodite'

import routerMiddleware from 'route/middleware'

import Root from 'main/containers/root'
import configureStore from 'main/store/configureStore'

let initialState = {}
import conf from 'conf'
let history = createBrowserHistory(conf.root ? {basename: conf.root} : {})

const store = configureStore(initialState, routerMiddleware(history))

render(
    <Root store={store} history={history} />,
    document.getElementById('app-mount'),
    document.getElementById('app-mount').firstElementChild
)
