import { html, render } from './../deps/react.js'
import { createBrowserHistory } from './../deps/history.js'
import routerMiddleware from './modules/route/middleware.js'
import Root from './modules/main/containers/root.js'
import configureStore from './modules/main/store/configureStore.js'

let initialState = {}
const conf = window.appConf

let history = createBrowserHistory(
    conf.root
        ? { basename: conf.root }
        : {}
)

const store = configureStore(initialState, routerMiddleware(history))

render(
    html`<${Root} store=${store} history=${history} />`,
    document.getElementById('app-mount'),
    document.getElementById('app-mount').firstElementChild
)
