'use strict';
var React = require('react');
var InfoLinks = require('./infoLinks.jsx');
var PageInfo = React.createClass({
    render: function () {

        return (
            <div className="site-info">
                <div className="primary-info">
                    <h1>{this.props.pageInfo.title}</h1>
                    <p>{this.props.pageInfo.subtitle}</p>
                    <p>{this.props.pageInfo.description}</p>
                </div>
                <InfoLinks path={this.props.pageInfo.path}/>
            </div>
        )
    }
});
module.exports = PageInfo;