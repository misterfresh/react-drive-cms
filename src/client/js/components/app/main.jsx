'use strict';
var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var Main = React.createClass({
    render: function () {
        return (
            <RouteHandler {...this.props} key={this.props.path} />
        )
    }
});
module.exports = Main;