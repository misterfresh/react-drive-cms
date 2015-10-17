'use strict';
var React = require('react');
var string = require('./../../../utils/utils').string;

var Post = React.createClass({
    render: function () {
        var self = this;
        var articleUrl = '#!/article/' + self.props.article.id + '/' + string.slug(self.props.article.title);
        var categoryUrl = '#!/category/' + self.props.article.category.id + '/' + string.slug(self.props.article.category.title);
        return (
            <div key={this.props.key} className="post-preview col-xs-10  no-gutter">
                <div>
                    <h2>
                        <a
                            role='button'
                            onClick={self.props.handleRouting.bind(null, self.props.article)}
                            href={articleUrl}
                            title={this.props.article.title}
                        >
                            {this.props.article.title}
                        </a>
                    </h2>

                </div>
                <p>{this.props.article.subtitle}</p>

                <p className="meta">
                    <span
                        title={"Comments for " + this.props.article.title}
                        data-disqus-url={window.location.protocol + window.location.hostname + '/' + articleUrl}
                        data-disqus-identifier={this.props.article.driveId}
                        className="disqus-comment-count"
                    >
                    </span>
                &nbsp;-&nbsp;
                    Published in : &nbsp;
                    <a
                        role='button'
                        onClick={self.props.handleRouting.bind(null, self.props.article.category)}
                        href={categoryUrl}
                        title={self.props.article.category.title}
                    >
                    {self.props.article.category.title}
                    </a>
                </p>
            </div>
        )
    }
});
module.exports = Post;