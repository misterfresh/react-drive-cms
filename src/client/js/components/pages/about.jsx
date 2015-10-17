'use strict';
var React = require('react');
var Row = require('react-bootstrap').Row;

var Page = require('./../layout/page/page.jsx');
var About = React.createClass({
    render: function () {

        var aboutInfo = {
            title: 'About',
            subtitle: 'React Drive CMS Demo',
            description: 'An easy way to publish articles directly from Google Drive',
            sidebarImage: '../images/default-about.jpg',
            path: "about"
        };

        return (
            <Page
                pageInfo={aboutInfo}
                menuVisible={this.props.menuVisible}
                categories={this.props.store.category}
                handleRouting={this.props.handleRouting}
                setMainProperty={this.props.setMainProperty}
                activeCategory={this.props.activeCategory}
                modal={this.props.modal}
            >
                <div className="author-bio">

                    <img src="https://raw.githubusercontent.com/misterfresh/react-drive-cms/gh-pages/images/react_logo.png"/>

                    <div className="author-bio__info">
                        <h1>React Drive CMS Demo</h1>
                        <p>A demo site to showcase the use of Google Drive as a Content Management System. Write articles in Google Docs and publish them directly from there.</p>
                        <p>Google Drive is the backend, only a few static files are hosted on GitHub Pages, and the content is displayed with React JS.</p>
                    </div>
                </div>


                <footer className="split-footer">
                    <a href="#!/contact">Contact</a>
                </footer>
            </Page>
        )
    }
});
module.exports = About;