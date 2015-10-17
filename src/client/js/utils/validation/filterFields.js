'use strict';
var FilterFields = function (formValues) {
    var filtered = {};
    var filter = {
        formValues: formValues,
        name: function (inputName) {
            var self = this;
            return self.trimToMaxLength(self.filterAlphaNumeric(inputName), 24);
        },
        email: function (inputEmail) {
            return inputEmail.replace(/[^A-Za-z0-9_\@\-\. ]/g, '');
        },
        company: function (inputCompany) {
            var self = this;
            return self.trimToMaxLength(self.filterAlphaNumeric(inputCompany), 24);
        },
        number: function (inputNumber) {
            inputNumber = inputNumber.replace(/\s/g, '');
            return inputNumber;
        },
        message: function (inputMessage) {
            var self = this;
            return self.trimToMaxLength(self.filterANPunctuation(inputMessage), 400);
        },
        filterAlphaNumeric: function (str) {
            return str.replace(/[^A-Za-z0-9_\u00E0\u00E2\u00E7\u00E8\u00E9\u00EA\u00EE\u00F4\u00FB\u00C7\u00C0\u00C9\u00CA\u00F9\- ]/g, '');
        },
        filterANPunctuation: function (str) {
            return str.replace(/[^A-Za-z0-9_\u00E0\u00E2\u00E7\u00E8\u00E9\u00EA\u00EE\u00F4\u00FB\u00C7\u00C0\u00C9\u00CA\u00F9\-\.\,\?\!\'\: ]/g, '');
        },
        trimToMaxLength: function (str, length) {
            return str.substr(0, length);
        }
    };
    for (var field in formValues) {
        if (formValues.hasOwnProperty(field)) {
            filtered[field] = filter[field](formValues[field]);
        }
    }
    return filtered;
};
module.exports = FilterFields;