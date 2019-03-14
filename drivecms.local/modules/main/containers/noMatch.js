import {html, Component} from '../../../react.js'
import { Helmet } from '../../../react-helmet.js'

const NoMatch = () => html`
    <div>
        <${Helmet} title="Not Found" />
        Page was not found
    </div>
`

export default NoMatch
