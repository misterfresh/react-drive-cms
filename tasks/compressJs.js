'use strict';
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var source = require("vinyl-source-stream");

module.exports = function (gulp) {
    return gulp.src('./assets/js/bundle.js')
        .pipe(uglify())
        .pipe(rename("bundle.min.js"))
        .pipe(gulp.dest('./assets/js'));
};