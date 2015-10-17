'use strict';
var React = require('react');
var string = require('./../../../utils/utils').string;

var Category = React.createClass({

    render: function () {
        var self = this;
        var categoryUrl = '#!/category/' + self.props.category.id + '/' + string.slug(self.props.category.title);
        var categoryStyle = {
            backgroundImage: 'url(' + self.props.category.image + ')'
        };
        return (
            <div
                className="category-preview col-xs-6 col-sm-4 image-category"
                style={categoryStyle}
            >
                <h2 className="category-title">
                    <a
                        role='button'
                        onClick={self.props.handleRouting.bind(null, self.props.category)}
                        href={categoryUrl}
                        title={self.props.category.title}
                    >
                    {self.props.category.title}
                    </a>
                </h2>
            </div>
        )
    }
});
module.exports = Category;