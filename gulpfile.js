var gulp = require('gulp')
var sass = require('gulp-sass')
var sourcemaps = require('gulp-sourcemaps')
var gmnf = require('gulp-main-npm-files')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var livereload = require('gulp-livereload')
var inject = require('gulp-inject')
var del = require('del')

gulp.task('default', ['sass', 'scripts', 'nodemodules', 'inject', 'watch'])

gulp.task('sass', function() {
	return gulp.src('./*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./'))
    .pipe(livereload());
})

gulp.task('scripts', function() {
	gulp.src('./!(gulpfile).js')
    .pipe(sourcemaps.init())
	.pipe(concat('script.js'))
	.pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./'));
})

gulp.task('nodemodules', function() {
	gulp.src(gmnf(), {base:'./'})
    .pipe(sourcemaps.init())
	.pipe(concat('vendor.js'))
	.pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./'));
})

gulp.task('inject', function () {
  var target = gulp.src('./index.html');
  // It's not necessary to read the files (will speed up things), we're only after their paths:
  var vendor = gulp.src(['./vendor.js'], {read: false});
  var sources = gulp.src(['./script.js', '*.css'], {read: false});
  return target.pipe(inject(vendor, {name: 'vendor'}))
  	.pipe(inject(sources))
    .pipe(gulp.dest('./'));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('./*.scss', ['sass']);
});

gulp.task('clean', function () {
  return del([
    'style.css', 'maps/**', 'script.js', 'vendor.js'
  ]);
});

gulp.task('clean-npm', function () {
  return del([
    'node_modules/**'
  ]);
});