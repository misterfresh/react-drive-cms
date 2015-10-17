'use strict';
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var source = require("vinyl-source-stream");

module.exports = function (gulp) {
    return gulp.src('./src/client/sass/main.scss')
        .pipe(sass())
        .pipe(rename("styles.css"))
        .pipe(gulp.dest('./assets/css'));
};