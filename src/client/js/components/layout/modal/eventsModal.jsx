'use strict';
var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;
var EventsModal = React.createClass({
    render: function () {
        var self = this;
        return (
            <Modal
                show={this.props.modal.show}
                onHide={this.hideModal}
                container={this}
                aria-labelledby="contained-modal-title"
                dialogClassName="page-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">{this.props.modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={this.props.modal.status}></div>{this.props.modal.contents}
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.hideModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        )
    },
    hideModal: function(){
        this.props.setMainProperty('modal', {
            show: false,
            loading: false,
            coolDown: false
        })
    }
});
module.exports = EventsModal;