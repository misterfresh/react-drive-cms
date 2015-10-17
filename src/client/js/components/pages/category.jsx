'use strict';
var React = require('react');
var Row = require('react-bootstrap').Row;
var Posts = require('./../lists/post/posts.jsx');
var Page = require('./../layout/page/page.jsx');
var DisqusCount = require('./../comments/disqusCount.jsx');
var Category = React.createClass({
    render: function () {
        var category = this.props.store.category[this.props.params.categoryId];
        var categoryInfo = {
            title: category.title,
            subtitle: '',
            description: '',
            sidebarImage: category.image,
            path: "category"
        };

        return (
            <Page
                pageInfo={categoryInfo}
                menuVisible={this.props.menuVisible}
                categories={this.props.store.category}
                handleRouting={this.props.handleRouting}
                setMainProperty={this.props.setMainProperty}
                activeCategory={this.props.activeCategory}
                modal={this.props.modal}
            >
                <div className="sub-nav">
                    <a
                        role='button'
                        className='select-posts active'
                        title='articles'
                    >
                        Posts
                    </a>
                </div>
                <Posts
                    articles={category.articles}
                    activeHomePanel={"articles"}
                    handleRouting={this.props.handleRouting}
                />
                <DisqusCount/>
            </Page>
        )
    }
});
module.exports = Category;