import React, { Component } from 'react'
import { Provider } from 'react-redux'
import ConnectedRouter from 'route/ConnectedRouter'
import { renderRoutes } from 'react-router-dom'
import { css } from 'aphrodite'
import routes from 'routes/routes'

import blocks from 'styles/blocks'

let Root = ({ store, history }) => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div className={css(blocks.wrapper)}>{renderRoutes(routes)}</div>
        </ConnectedRouter>
    </Provider>
)

export default Root
