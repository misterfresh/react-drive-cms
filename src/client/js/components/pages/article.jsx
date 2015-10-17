'use strict';
var React = require('react');
var Row = require('react-bootstrap').Row;
var Footer = require('./../layout/footer/footer.jsx');
var Menu = require('./../layout/menu/menu.jsx');
var MenuBurger = require('./../layout/menu/menuBurger.jsx');
var DisqusThread = require('./../comments/disqusThread.jsx');
var Article = React.createClass({
    componentDidMount: function () {

    },
    render: function () {
        var headerStyle = {
            backgroundImage: 'url(' + this.props.currentPage.image + ')'
        };
        return (
            <div >
                <Menu
                    menuVisible={this.props.menuVisible}
                    categories={this.props.store.category}
                    handleRouting={this.props.handleRouting}
                    setMainProperty={this.props.setMainProperty}
                    activeCategory={this.props.activeCategory}
                />
                <div className={('container page-fadein page-article container-menu-' + (this.props.menuVisible ? 'open' : 'closed'))}>
                    <header className="hero-image" role="banner" style={headerStyle}>
                        <MenuBurger
                            setMainProperty={this.props.setMainProperty}
                            menuVisible={this.props.menuVisible}
                        />
                    </header>
                    <main >
                        <Row>
                            <div className="col-xs-12 single-content">
                                <h1>{this.props.currentPage.title}</h1>
                                <p className="subtitle">{this.props.currentPage.subtitle}</p>
                                <div dangerouslySetInnerHTML={{__html: this.props.currentPage.body}}></div>
                            </div>
                        </Row>
                    </main>
                    <DisqusThread
                        id={this.props.currentPage.driveId}
                        title={this.props.currentPage.title}
                    />
                    <Footer
                        lastUpdated={this.props.currentPage.lastUpdated}
                        category={this.props.currentPage.category}
                        author={this.props.config.author}
                        articles={this.props.store.view.articles}
                        handleRouting={this.props.handleRouting}
                    />
                </div>
            </div>
        )
    }
});
module.exports = Article;