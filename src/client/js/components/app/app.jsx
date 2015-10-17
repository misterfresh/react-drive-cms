'use strict';
var React = require('react');
var _ = require('lodash');
var noop = function () {
};
var Main = require('./main.jsx');

var App = function (drive, views, route) {
    return React.createClass({
        getInitialState: function () {
            var self = this;
            return {
                store: {
                    article: [],
                    category: views.categories,
                    page: [],
                    view: views
                },
                currentRoute: views.routeParams.elementPath,
                activeHomePanel: 'articles',
                currentPage: (views.article ? views.article : {}),
                menuVisible: true,
                activeCategory: {
                    activeId: 0,
                    expanded: false
                },
                config: window.configReactDriveCms,
                modal: {
                    show: false
                }
            };
        },

        setMainProperty: function (property, value, callback) {
            var self = this;
            callback = callback || noop;
            var objMod = {};
            objMod[property] = value;
            self.setState(objMod, function () {
                callback(value);
            });
        },
        contextTypes: {
            router: React.PropTypes.func
        },
        loadElement: function (elementType, elementId, callback) {
            var self = this;
            callback = callback || noop;
            if (typeof self.state.store[elementType][elementId] !== 'undefined') {
                self.setState({
                    currentPage: self.state.store[elementType][elementId]
                }, function () {
                    callback(self.state.store[elementType][elementId])
                });
            } else {
                self.fetchElementData(elementType, elementId, callback);
            }
        },
        fetchElementData: function (elementType, elementId, callback) {
            var self = this;
            callback = callback || noop;
            switch (elementType) {
                case 'article':
                    var elementFileId = self.state.store.view.articles[elementId]['driveId'];
                    drive.getElementHtml(elementFileId, function (elementHtml) {
                        var element = self.state.store.view.articles[elementId];
                        element['body'] = elementHtml;
                        var stateUpdate = {};
                        var store = self.state.store;
                        store[elementType][elementId] = element;
                        stateUpdate['currentPage'] = element;
                        stateUpdate['store'] = store;
                        self.setState(stateUpdate, function () {
                            callback(element);
                        });
                    });
                    break;
                case 'category':
                    break;
            }
        },
        handleRouting: function (element, e) {
            e.preventDefault();
            e.stopPropagation();
            var routeSplit = e.target.href.split('#!');
            var route = routeSplit[1];
            var self = this;
            self.loadElement(element.type, element.id, function () {
                self.goToRoute(route);
            });
        },
        goToRoute: function (route) {
            var self = this;
            self.context.router.transitionTo(route);
        },
        render: function () {
            var path = this.context.router.getCurrentPath();
            return (
                <Main
                    store={this.state.store}
                    currentPage={this.state.currentPage}
                    path={path}
                    activeHomePanel={this.state.activeHomePanel}
                    setMainProperty={this.setMainProperty}
                    menuVisible={this.state.menuVisible}
                    handleRouting={this.handleRouting}
                    activeCategory={this.state.activeCategory}
                    config={this.state.config}
                    modal={this.state.modal}
                />
            )
        }
    });
};
module.exports = App;