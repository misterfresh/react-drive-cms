'use strict';
var React = require('react');
var Row = require('react-bootstrap').Row;
var Posts = require('./../lists/post/posts.jsx');
var Categories = require('./../lists/category/categories.jsx');
var Page = require('./../layout/page/page.jsx');
var DisqusCount = require('./../comments/disqusCount.jsx');
var Home = React.createClass({

    render: function () {
        var homeInfo = {
            title: 'Cats',
            subtitle: 'React Drive CMS Demo',
            description: 'Publish articles directly from Google Drive to your website.',
            sidebarImage: '../images/default-sidebar.jpg',
            path: "home"
        };

        return (
            <Page
                pageInfo={homeInfo}
                menuVisible={this.props.menuVisible}
                categories={this.props.store.category}
                handleRouting={this.props.handleRouting}
                setMainProperty={this.props.setMainProperty}
                activeCategory={this.props.activeCategory}
                modal={this.props.modal}
            >
                <div className="sub-nav">
                    <a role='button'
                        className={'select-posts' + ((this.props.activeHomePanel === 'articles') ? ' active' : '')}
                        title='articles'
                        onClick={this.setActivePanel}
                    >
                        Posts
                    </a>
                    <a role='button'
                        className={'select-categories' + ((this.props.activeHomePanel === 'categories') ? ' active' : '')}
                        title='categories'
                        onClick={this.setActivePanel}
                    >
                        Categories
                    </a>
                </div>
                <Posts
                    articles={this.props.store.view.articles}
                    activeHomePanel={this.props.activeHomePanel}
                    handleRouting={this.props.handleRouting}
                />
                <Categories
                    categories={this.props.store.category}
                    activeHomePanel={this.props.activeHomePanel}
                    handleRouting={this.props.handleRouting}
                />
                <DisqusCount/>
            </ Page>
        )
    },
    setActivePanel: function (e) {
        this.props.setMainProperty('activeHomePanel', e.target.title);
    }

});
module.exports = Home;