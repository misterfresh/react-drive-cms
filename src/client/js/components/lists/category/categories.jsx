'use strict';
var React = require('react');

var Category = require('./category.jsx');
var Categories = React.createClass({

    render: function () {
        var self = this;
        return (
            <div className={"home-page-categories" + ((this.props.activeHomePanel === 'categories') ? ' section-fadein' : ' hide')}>
                <div className="category row">
                    <section>
                        {self.props.categories.map(function (category, i) {
                            return <Category
                                key={i}
                                category={category}
                                handleRouting={self.props.handleRouting}
                            />;
                        })}
                    </section>
                </div>
            </div>
        )
    }
});
module.exports = Categories;