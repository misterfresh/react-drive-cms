'use strict';
var React = require('react');
var Row = require('react-bootstrap').Row;
var Sidebar = require('./../sidebar/sidebar.jsx');
var Menu = require('./../menu/menu.jsx');
var EventsModal = require('./../modal/eventsModal.jsx');
var Page = React.createClass({
    render: function () {
        return (
            <div>
                <Menu
                    menuVisible={this.props.menuVisible}
                    categories={this.props.categories}
                    handleRouting={this.props.handleRouting}
                    setMainProperty={this.props.setMainProperty}
                    activeCategory={this.props.activeCategory}
                />
                <main className={('container page-fadein left-container' + ' page-' + this.props.pageInfo.path + ' container-menu-' + (this.props.menuVisible ? 'open' : 'closed'))}>
                    <Row>
                        <Sidebar
                            setMainProperty={this.props.setMainProperty}
                            pageInfo={this.props.pageInfo}
                            menuVisible={this.props.menuVisible}
                        />
                        <section className="col-md-7 col-sm-12 col-md-offset-5 main-content modal-container">
                            {this.props.children}
                            <EventsModal
                                modal={this.props.modal}
                                setMainProperty={this.props.setMainProperty}
                            />
                        </section>
                    </Row>
                </main>
            </div>
        )
    }

});
module.exports = Page;