'use strict';
var React = require('react');
var string = require('./../../../utils/utils').string;
var OtherArticle = React.createClass({
    render: function () {
        var self = this;

        var otherArticleStyle = {
            backgroundImage: 'url(' + this.props.article.image + ')'
        };
        var articleUrl = '#!/article/' + self.props.article.id + '/' + string.slug(self.props.article.title);
        return (

            <div key={this.props.key} className="col-sm-6 col-md-2 no-gutter read-another-container image-read-another" style={otherArticleStyle}>
                <div className="overlay"></div>

                <h3 className="read-another">
                    <a
                        className="read-another-link"
                        role='button'
                        onClick={self.props.handleRouting.bind(null, this.props.article)}
                        href={articleUrl}
                        title={this.props.article.title}
                    >
                    {this.props.article.title}
                    </a>
                </h3>
            </div>
        )
    }
});
module.exports = OtherArticle;