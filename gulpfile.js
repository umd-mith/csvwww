var gulp = require('gulp');
var bower = require('gulp-bower');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');


gulp.task('default', function() {
	gulp.start('bower', 'react', 'css', 'js');
});

gulp.task('develop', function() {
	nodemon({script: 'bin/www', ext: 'js jsx css hbs', ignore: ['./build/**']})
	  .on('change', ['default'])
});

gulp.task('react', function() {
	return gulp.src('templates/*.jsx')
	  .pipe(react())
	  .pipe(gulp.dest('public/js/'));
});

gulp.task('bower', function() {
	return bower();
});

gulp.task('css', function() {
	return gulp.src([
		'bower_components/foundation/css/foundation.css',
		'bower_components/foundation/css/normalize.css',
		'css/style.css'
	]).pipe(gulp.dest('public/css/'));
});

gulp.task('js', function() {
	return gulp.src([
		  'bower_components/modernizr/modernizr.js',
		  'bower_components/fastclick/lib/fastclick.js',
		  'bower_components/foundation/js/foundation.min.js',
      'bower_components/jquery/dist/jquery.min.js',
      "bower_components/react/react.min.js"
		])
	  .pipe(gulp.dest('public/js/'))
});

gulp.task('watch', function() {
	gulp.watch('templates/*', ['react', 'js']);
	gulp.watch('css/*', ['css'])
});
