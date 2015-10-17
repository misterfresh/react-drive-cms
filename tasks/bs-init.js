'use strict';
var browserSync = require('browser-sync');

module.exports = function () {

    // for more browser-sync config options: http://www.browsersync.io/docs/options/
    browserSync.init({

        // watch the following files; changes will be injected (css & images) or cause browser to refresh
        files: ['assets/**/*.*'],

        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'http://localhost:3000',
        notify: true,
        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000

        // open the proxied app in chrome
        //browser: ['google chrome']
    });
};