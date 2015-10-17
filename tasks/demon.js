'use strict';
var nodemon = require('gulp-nodemon');
var browserSync = require('browser-sync');
var BROWSER_SYNC_RELOAD_DELAY = 500;

module.exports = function (cb) {
    var called = false;
    (function() {
        var childProcess = require("child_process");
        var oldSpawn = childProcess.spawn;
        function mySpawn() {
            console.log('spawn called');
            console.log(arguments);
            var result = oldSpawn.apply(this, arguments);
            return result;
        }
        childProcess.spawn = mySpawn;
    })();
    return nodemon({
        verbose: true,
        script: 'src/server/server.js',
        ignore: ['gulpfile.js','.idea','.git','node_modules','tasks'],
        watch: ['src/server/server.js'],
        env: {
            'NODE_ENV': 'development'
        },
        nodeArgs: ['--debug']
    })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) { cb(); }
            called = true;
        })
        .on('change', function () {
            //console.log('changed!');
            setTimeout(function reload() {
                browserSync.reload({
                    stream: true   //
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({
                    stream: false   //
                });
            }, BROWSER_SYNC_RELOAD_DELAY);
        });
};