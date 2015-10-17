'use strict';
var React = require('react');
var ReadOther = require('./readOther.jsx');
var Credits = require('./credits.jsx');
var Footer = React.createClass({
    render: function () {
        return (
            <footer className="single">
                <Credits
                    lastUpdated={this.props.lastUpdated}
                    category={this.props.category}
                    author={this.props.author}
                />
                <ReadOther
                    articles={this.props.articles}
                    handleRouting={this.props.handleRouting}
                />
            </footer>
        )
    }
});
module.exports = Footer;