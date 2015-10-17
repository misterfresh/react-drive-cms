'use strict';
var React = require('react');
var noop = function () {
};

var MenuBurger = React.createClass({
    render: function () {
        return (
            <a
                className="menu-trigger animated fadeInDown"
                role="button"
                onClick={this.toggleMenuVisible}
            >
                <span className="bar"></span>
                <span className="bar"></span>
                <span className="bar"></span>
            </a>
        )
    },
    toggleMenuVisible: function () {
        var self = this;
        this.props.setMainProperty("menuVisible", !self.props.menuVisible, noop);
    }
});
module.exports = MenuBurger;