import { html, Component } from '../../../../deps/react.js'
import { Helmet } from '../../../../deps/react-helmet.js'

const NoMatch = () => html`
    <div>
        <${Helmet} title="Not Found" />
        Page was not found
    </div>
`

export default NoMatch
