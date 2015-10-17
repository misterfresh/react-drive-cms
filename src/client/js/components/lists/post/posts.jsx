'use strict';
var React = require('react');
var Post = require('./post.jsx');

var Posts = React.createClass({
    render: function () {
        var self = this;
        return (
            <div className={"home-page-posts" + ((this.props.activeHomePanel === 'articles') ? ' section-fadein' : ' hide')}>
                {this.props.articles.map(function (article, i) {
                    return <article key={i} className="post">
                        <Post
                            key={i}
                            article={article}
                            handleRouting={self.props.handleRouting}
                        />
                    </article>;
                })}
            </div>
        )
    }
});
module.exports = Posts;