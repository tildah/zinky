var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');

gulp.task('pug', function buildHTML() {
  return gulp.src('./pug/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('./'))
});

gulp.task('sass', function () {
  return gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch('./pug/*.pug', ['pug']);
  gulp.watch('./scss/*.scss', ['sass']);
});

