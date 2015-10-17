'use strict';
var ValidateFields = function (formValues) {
    var isValid = {};
    isValid['all'] = true;
    var validator = {
        formValues: formValues,
        name: function (inputName) {
            var self = this;
            return ( self.checkMinLength(inputName, 4));
        },
        email: function (inputEmail) {
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return filter.test(inputEmail);
        },
        company: function (inputCompany) {
            var self = this;
            return ( self.checkMinLength(inputCompany, 3));
        },
        number: function (inputNumber) {
            inputNumber = inputNumber.replace(/\s/g, '');
            var filter = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
            return filter.test(inputNumber);
        },
        message: function (inputMessage) {
            var self = this;
            return ( self.checkMinLength(inputMessage, 5));
        },
        checkAlphaNumeric: function (str) {
            return true;
        },
        checkMinLength: function (str, length) {
            return (str.length >= length);
        }
    };
    for (var field in formValues) {
        if (formValues.hasOwnProperty(field)) {
            var validField = validator[field](formValues[field]);
            isValid[field] = (validField) ? 'success' : 'error';
            if (!validField) {
                isValid['all'] = false;
            }
        }
    }
    return isValid;
};
module.exports = ValidateFields;