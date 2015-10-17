'use strict';
var React = require('react');
var config = window.configReactDriveCms;
var DisqusCount = React.createClass({
    addDisqusScript: function () {
        var self = this;
        var child = self.disqusCount = document.createElement('script');
        var parent = document.getElementsByTagName('head')[0] ||
            document.getElementsByTagName('body')[0];
        child.async = true;
        child.type = 'text/javascript';
        child.src = '//' + config.shortname + '.disqus.com/count.js';
        parent.appendChild(child);
    },

    removeDisqusScript: function () {
        var self = this;
        if (self.disqusCount && self.disqusCount.parentNode) {
            self.disqusCount.parentNode.removeChild(self.disqusCount);
            self.disqusCount = null;
        }
    },

    componentDidMount: function () {
        var self = this;
        window.disqus_shortname = config.shortname;
        if (typeof window.DISQUSWIDGETS !== "undefined") {
            window.DISQUSWIDGETS = undefined;
        }
        self.addDisqusScript();
    },

    componentWillUnmount: function () {
        var self = this;
        self.removeDisqusScript();
    },

    render: function () {
        return (
            <span id="disqus-comments-count"></span>
        );
    }
});
module.exports = DisqusCount;