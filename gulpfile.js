var gulp = require('gulp');
var pug = require('gulp-pug');

gulp.task('pug', function buildHTML() {
  return gulp.src('./pug/*.pug')
    .pipe(pug({}))
    .pipe(gulp.dest('./'))
});

gulp.task('watch', function () {
  gulp.watch('./pug/*.pug', ['pug']);
});

