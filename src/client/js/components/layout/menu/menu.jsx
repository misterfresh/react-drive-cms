'use strict';
var React = require('react');
var MenuCategory = require('./menuCategory.jsx');
var Menu = React.createClass({
    render: function () {
        var self = this;
        return (
            <div id="menu" className={(this.props.menuVisible) ? 'menu-open' : 'menu-collapsed'}>
                <ul>
                    <li>
                        <i className="fa fa-home"></i>
                        <a href="#!/home">Home</a>
                    </li>
                    <li>
                        <i className="fa fa-user"></i>
                        <a href="#!/about">About</a>
                    </li>
                    <li>
                        <i className="fa fa-paper-plane"></i>
                        <a href="#!/contact">Contact</a>
                    </li>
                </ul>
                <hr />
                <ul className="menu-category-list">
                    {self.props.categories.map(function (category, i) {
                        return < MenuCategory
                            key={i}
                            category={category}
                            handleRouting={self.props.handleRouting}
                            setMainProperty={self.props.setMainProperty}
                            activeCategory={self.props.activeCategory}
                        />;
                    })}
                </ul>
            </div>
        )
    }
});
module.exports = Menu;