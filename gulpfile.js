'use strict';
var gulp = require('gulp');

gulp.task('sass', function () {
    return require('./tasks/sass.js')(gulp);
});

gulp.task('compressJs', function () {
    return require('./tasks/compressJs.js')(gulp);
});

gulp.task('compressCss', function () {
    return require('./tasks/compressCss.js')(gulp);
});

gulp.task('browserify', function () {
    return require('./tasks/browserify.js')(gulp);
});

gulp.task('watchify', function(){
    return require('./tasks/watchify.js')(gulp);
});

gulp.task('demon', function(cb){
    return require('./tasks/demon.js')(cb);
});

gulp.task('browser-sync', ['demon'], function (){
    return require('./tasks/bs-init.js')();
});

gulp.task('compress', ['compressJs', 'compressCss']);
gulp.task('init', ['browserify', 'sass']);

// Default Task
gulp.task('default', ['watchify','browser-sync'], function () {
    gulp.watch("src/client/sass/**/*.{sass,scss}", ['sass']);
});