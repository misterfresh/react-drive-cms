'use strict';
var React = require('react');
var string = require('./../../../utils/utils').string;
var Row = require('react-bootstrap').Row;
var Credits = React.createClass({
    render: function () {
        var self = this;
        var categoryUrl = '#!/category/' + self.props.category.id + '/' + string.slug(self.props.category.title);
        var date = string.formatDate(self.props.lastUpdated);
        return (
            <Row >
                <div className="col-xs-12 col-sm-2">
                    <a href="#!/about">
                        <img src="images/profile-1.jpg" className="user-icon " alt="user-image" />
                    </a>
                </div>
                <div className="col-xs-12 col-sm-6">
                    <div className="credits-info">
                        <p>Published on the
                            <span className="credits-underline">{date}</span>
                        </p>
                        <p>
                            <span className="credits-separator">by</span>
                            <a href="#!/about">
                                {self.props.author}
                            </a>
                            <span className="credits-separator">in</span>
                            <a
                                href={categoryUrl}
                            >
                                {self.props.category.title}
                            </a>
                        </p>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-4">
                    <div className="social">
                        <p>Share this article</p>
                        <div className="social-links">
                            <a className="social-icon" href="#" data-platform="twitter" data-message="Message about this post" >
                                <i className="fa fa-twitter"></i>
                            </a>

                            <a className="social-icon" href="#" data-platform="facebook" data-message="Message about this post" >
                                <i className="fa fa-facebook-official"></i>
                            </a>

                            <a className="social-icon" data-platform="mail"  href="#!/contact">
                                <i className="fa fa-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }
});
module.exports = Credits;