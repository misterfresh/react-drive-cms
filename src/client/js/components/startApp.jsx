'use strict';
var React = require('react');
var Router = require('react-router');
var HashbangLocation = require('./app/hashbangLocation.jsx');
var startApp = function (drive, views) {
    var App = require('./app/app.jsx')(drive, views);
    var routes = require('./app/routes.jsx')(App);
    Router.run(routes, HashbangLocation, function (Handler) {
        React.render(<Handler />, document.getElementById('app-mount'));
    });
};
module.exports = startApp;