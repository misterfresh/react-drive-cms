import {html, PureComponent} from '../../../react.js'
import { Provider } from '../../../react-redux.js'
import ConnectedRouter from '../../../modules/route/ConnectedRouter.js'
import { renderRoutes } from '../../../react-router-dom.js'
import { css } from '../../../aphrodite.js'
import routes from '../../../routes/routes.js'

import blocks from '../../../styles/blocks.js'

class Root extends PureComponent {
    render({ store, history }){
        return html`
    <${Provider} store=${store}>
        <${ConnectedRouter} history=${history}>
            <div className=${css(blocks.wrapper)}>${renderRoutes(routes)}</div>
        <//>
    <//>
`
    }
}


export default Root
