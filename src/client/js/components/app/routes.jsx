'use strict';
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var Redirect = Router.Redirect;
var NotFoundRoute = Router.NotFoundRoute;

var Home = require('./../pages/home.jsx');
var About = require("./../pages/about.jsx");
var Contact = require("./../pages/contact.jsx");
var Article = require("./../pages/article.jsx");
var Category = require("./../pages/category.jsx");

var routes = function (App) {
    return (
        <Route name="app" path="/" handler={App}>
            <Route name="home" path="home" handler={Home}/>
            <Route name="about" path="about" handler={About}/>
            <Route name="contact" path="contact" handler={Contact}/>
            <Route name="article" path="article/:articleId/:slug" handler={Article}/>
            <Route name="category" path="category/:categoryId/:slug" handler={Category}/>
            <DefaultRoute handler={Home}/>
            <Redirect from="/page1" to="home" />
            <NotFoundRoute handler={App}/>
        </Route>
    );
};
module.exports = routes;