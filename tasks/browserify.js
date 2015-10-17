'use strict';
var browserify = require('browserify');
var rename = require('gulp-rename');
var source = require("vinyl-source-stream");
var reactify = require('reactify');

module.exports = function (gulp) {
    var b = browserify();
    b.transform(reactify); // use the reactify transform
    b.add('./src/client/client.js');
    return b.bundle()
        .pipe(source('./src/client/client.js'))
        .pipe(rename("bundle.js"))
        .pipe(gulp.dest('./assets/js'));
};