'use strict';

var jshint = require('gulp-jshint');
var gulp   = require('gulp');

gulp.task('default', function() {
  return gulp.src('./*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});