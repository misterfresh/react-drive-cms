'use strict';
var $ = window.$;
var config = window.configReactDriveCms;
var drive = require('./js/driveAccess/drive')(config, $);
drive.init(function (views) {
        require('./js/components/startApp.jsx')(drive, views);
    }
);