import { html, Component } from '../../../deps/react.js'
import PropTypes from '../../../deps/prop-types.js'
import { Router } from '../../../deps/react-router-dom.js'
import { LOCATION_CHANGE } from './actionTypes.js'

class ConnectedRouter extends Component {
    constructor(props) {
        super(props)
        this.handleLocationChange = this.handleLocationChange.bind(this)
    }

    handleLocationChange(location) {
        this.store.dispatch({
            type: LOCATION_CHANGE,
            location,
        })
    }

    componentWillMount() {
        const { store: propsStore, history } = this.props
        this.store = propsStore || this.context.store
        this.handleLocationChange(history.location)
    }

    componentDidMount() {
        const { history } = this.props
        this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
    }

    componentWillUnmount() {
        if (this.unsubscribeFromHistory) this.unsubscribeFromHistory()
    }

    render() {
        return html`<${Router} ...${this.props} />`
    }
}

ConnectedRouter.propTypes = {
    store: PropTypes.object,
    history: PropTypes.object,
    children: PropTypes.node,
}

ConnectedRouter.contextTypes = {
    store: PropTypes.object,
}

export default ConnectedRouter
