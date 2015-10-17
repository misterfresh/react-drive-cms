'use strict';
var React = require('react');

var InfoLinks = React.createClass({
    render: function () {
        if (this.props.path !== 'home' && this.props.path !== 'about') {
            return (<div></div>)
        }
        return (
            <div>
                <div className="secondary-info">
                    <p>
                        <a
                            className="btn btn-primary btn-front-left"
                            href="https://docs.google.com/folderview?id=0B0A_zASTMp9WU0NMYW9wXzVQWjg&usp=drivesdk"
                            target="_blank"
                        >
                            View the original posts on Drive
                        </a>
                    </p>
                </div>
                <div className="secondary-info">
                    <p>
                        <a
                            className="btn btn-primary btn-front-right"
                            href="https://github.com/misterfresh/react-drive-cms/tree/master"
                            target="_blank"
                        >
                            View the source on GitHub
                        </a>
                    </p>
                </div>
            </div>
        )
    }
});
module.exports = InfoLinks;