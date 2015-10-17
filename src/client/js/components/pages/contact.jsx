'use strict';
var React = require('react');
var Input = require('react-bootstrap').Input;

var Page = require('./../layout/page/page.jsx');
var validation = require('./../../utils/utils').validation;
var message = require('./../../utils/utils').message;
var noop = function () {};
var Contact = React.createClass({
    getInitialState: function(){
        return {
            formValues: {
                name: '',
                email: '',
                company: '',
                number: '',
                message: ''
            },
            inputStyles: {
                name: 'warning',
                email: 'warning',
                company: 'warning',
                number: 'warning',
                message: 'warning'
            }
        }
    },
    render: function(){
        var self = this;
        var contactInfo = {
            title: 'Contact',
            subtitle: 'Get in touch with us',
            description: '',
            sidebarImage: '../images/default-contact.jpg',
            path: "contact"
        };
        var formFields = [
            {
                name: 'name',
                label: 'Your Name',
                type: 'text',
                placeholder: 'Jack Smith'
            },
            {
                name: 'email',
                label: 'Your Email',
                type: 'text',
                placeholder: 'example@mail.com'
            },
            {
                name: 'company',
                label: 'Company',
                type: 'text',
                placeholder: 'Example Corporation'
            },
            {
                name: 'number',
                label: 'Phone Number',
                type: 'tel',
                placeholder: '+44778765439'
            },
            {
                name: 'message',
                label: 'Your Message',
                type: 'textarea',
                placeholder: "Hello, let's chat!"
            }
        ];
        return (
            <Page
                pageInfo={contactInfo}
                menuVisible={this.props.menuVisible}
                categories={this.props.store.category}
                handleRouting={this.props.handleRouting}
                setMainProperty={this.props.setMainProperty}
                activeCategory={this.props.activeCategory}
                modal={this.props.modal}
            >
                <h3>Send me an email</h3>
                <form>
                    {formFields.map(function(field, i) {
                        return <div className="form-group" key={i}>
                            <label htmlFor={field.name}>{field.label}</label>
                            <Input
                                type={field.type}
                                className="form-control"
                                name={field.name}
                                value={self.state.formValues[field.name]}
                                onChange={self.updateThisField}
                                placeholder={field.placeholder}
                                bsStyle={self.state.inputStyles[field.name]}
                            />
                        </div>;
                    })}
                    <div className="form-group">
                        <input
                            id="send-message"
                            className="btn btn-default"
                            type="button"
                            value="Send"
                            onClick={this.sendMail}
                        />
                    </div>
                </form>
                <footer className="split-footer">
                    <a href="#!/about">About</a>
                </footer>
            </Page>
        )
    },
    updateFieldValue: function(property, value, callback){
        var self = this;
        var fields = self.state.formValues;
        callback = callback || noop;
        fields[property] = value;
        self.setState({
            'formValues': fields
        }, callback);
    },
    updateThisField: function(event){
        var self = this;
        self.updateFieldValue(event.target.name, event.target.value, function(){
            var filtered = validation.filterFields(self.state.formValues);
            self.setState({
                formValues: filtered
            }, function(){
                console.log(self.state.formValues);
            });
        });
    },
    validateFields: function(callback){
        var self = this;
        callback = callback || noop;
        var isValid = validation.validateFields(self.state.formValues);
        self.setState({
           inputStyles: isValid
        },function(){
            if(isValid['all']){
                callback(isValid);
            }
        });
    },
    sendMail: function(e){
        var self = this;
        e.preventDefault();
        e.stopPropagation();
        if(self.props.modal.coolDown === true){
            return false;
        }
        self.validateFields(function(isValid){
            console.log(isValid);
            self.props.setMainProperty('modal', {
                show: true,
                status: 'loading',
                coolDown: true,
                title: 'Sending Email',
                contents: 'Please wait... '
            }, function(){
                message.sendMail(self.state.formValues, function(response){
                    console.log(response);
                    var modal = {
                        show: true,
                        coolDown: false,
                        status: 'success',
                        title: 'Message Sent',
                        contents: 'Thank you!'
                    };
                    if(response.code !== 200){
                        modal['status'] = 'error';
                        modal['title'] = 'Operation Failed';
                        modal['contents'] = 'Please try again.'
                    }
                    self.props.setMainProperty('modal', modal);
                });
            });
        });
    }
});
module.exports = Contact;