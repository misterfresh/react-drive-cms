import React, { PureComponent } from 'react'
import { Helmet } from 'react-helmet'

class NoMatch extends PureComponent {
    render() {
        return (
            <div>
                <Helmet title="Not Found" />
                Page was not found
            </div>
        )
    }
}

export default NoMatch
