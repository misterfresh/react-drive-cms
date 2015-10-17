'use strict';
var noop = function () {
};

var sendMail = function (formValues, callback) {
    callback = callback || noop;
    var $ = window.$;
    var config = window.configReactDriveCms;
    console.log(JSON.stringify(formValues));

    getInfo(function (info) {
        formValues['ip'] = info.address;
        formValues['country'] = info.countryName;
        $.ajax({
            type: "GET",
            dataType: 'jsonp',
            data: formValues,
            url: "https://script.google.com/macros/s/" + config.sendMailUrlId + "/exec"
        }).done(function (response) {
            callback(response);
        });
    });
};

var getInfo = function (callback) {
    callback = callback || noop;
    var $ = window.$;
    $.ajax({
        type: "GET",
        dataType: 'jsonp',
        url: "http://smart-ip.net/info-json"
    }).done(function (response) {
        callback(response);
    });
};

module.exports = sendMail;