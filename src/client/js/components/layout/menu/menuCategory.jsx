'use strict';
var React = require('react');
var noop = function () {
};
var MenuCategoryArticles = require('./menuCategoryArticles.jsx');
var MenuCategory = React.createClass({
    render: function () {
        var self = this;
        var isActive = (self.props.activeCategory.activeId === self.props.category.id);
        var isExpanded = isActive ? self.props.activeCategory.expanded : false;
        var expData = {
            key: self.props.category.id,
            isActive: isActive,
            isExpanded: isExpanded
        };
        return (
            <li key={self.props.key} className={("menu-category-item" + (isExpanded ? ' category-expanded' : ''))}>
                <i className={("fa fa-chevron-right" + (isExpanded ? ' chevron-expanded' : ' chevron'))}></i>
                <a
                    onClick={self.setActiveCategory.bind(null, expData)}
                    role="button"
                    title={self.props.category.title}
                >{self.props.category.title}</a>
                < MenuCategoryArticles
                    articles={self.props.category.articles}
                    handleRouting={self.props.handleRouting}
                    expanded={isExpanded}
                />
            </li>
        );
    },
    setActiveCategory: function (expData) {
        var self = this;
        if (!expData.isActive) {
            self.props.setMainProperty("activeCategory", {
                activeId: expData.key,
                expanded: true
            }, noop);
        } else {
            self.props.setMainProperty("activeCategory", {
                activeId: expData.key,
                expanded: !expData.isExpanded
            }, noop);
        }
    }
});
module.exports = MenuCategory;