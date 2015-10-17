'use strict';
var rename = require('gulp-rename');
var source = require("vinyl-source-stream");
var minifyCss = require('gulp-minify-css');

module.exports = function (gulp) {
    return gulp.src('./assets/css/styles.css')
        .pipe(minifyCss())
        .pipe(rename("styles.min.css"))
        .pipe(gulp.dest('./assets/css'));
};