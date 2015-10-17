'use strict';
var React = require('react');
var config = window.configReactDriveCms;

var DisqusThread = React.createClass({

    addDisqusScript: function () {
        var self = this;
        var child = self.disqus = document.createElement('script');
        var parent = document.getElementsByTagName('head')[0] ||
            document.getElementsByTagName('body')[0];
        child.async = true;
        child.type = 'text/javascript';
        child.src = '//' + config.shortname + '.disqus.com/embed.js';
        parent.appendChild(child);
    },

    removeDisqusScript: function () {
        var self = this;
        if (self.disqus && self.disqus.parentNode) {
            self.disqus.parentNode.removeChild(self.disqus);
            self.disqus = null;
        }
    },

    componentDidMount: function () {
        var self = this;
        window.disqus_shortname = config.shortname;
        window.disqus_identifier = self.props.id;
        window.disqus_title = self.props.title;
        window.disqus_url = window.location.href;

        if (typeof window.DISQUS !== "undefined") {
            window.DISQUS.reset({reload: true});
        } else {
            self.addDisqusScript();
        }
    },

    componentWillUnmount: function () {
        var self = this;
        self.removeDisqusScript();
    },

    render: function () {
        return (
            <div id="disqus_thread"></div>
        );
    }
});
module.exports = DisqusThread;