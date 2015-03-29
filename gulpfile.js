var gulp = require('gulp');
var bower = require('gulp-bower');
var mocha = require('gulp-mocha');
var react = require('gulp-react');
var nodemon = require('gulp-nodemon');
var rimraf = require('rimraf');
var models = require('./models')

gulp.task('default', function() {
  gulp.start('bower', 'react', 'css', 'js', 'images');
});

gulp.task('develop', function() {
  nodemon({script: 'bin/www', ext: 'js jsx css hbs images', ignore: ['./build/**']})
    .on('change', ['default']);
});

gulp.task('react', function() {
  return gulp.src('views/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('public/js/'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('css', function() {
  return gulp.src([
    'bower_components/foundation/css/foundation.css',
    'bower_components/foundation/css/foundation.css.map',
    'bower_components/foundation/css/normalize.css',
    'bower_components/foundation/css/normalize.css.map',
    'css/style.css'
  ]).pipe(gulp.dest('public/css/'));
});

gulp.task('images', function() {
  return gulp.src('images/*')
    .pipe(gulp.dest('public/images'));
});

gulp.task('js', function() {
  return gulp.src([
      'bower_components/modernizr/modernizr.js',
      'bower_components/fastclick/lib/fastclick.js',
      'bower_components/foundation/js/foundation.min.js',
      'bower_components/react-modal/dist/react-modal.min.js',
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/jquery/dist/jquery.min.map',
      "bower_components/react/react.min.js",
      "bower_components/papaparse/papaparse.min.js",
      "bower_components/reactable/build/reactable.js"
    ])
    .pipe(gulp.dest('public/js/'));
});

gulp.task('watch', function() {
  gulp.watch('templates/*', ['react', 'js']);
  gulp.watch('css/*', ['css']);
});

gulp.task('test', function() {
  return gulp.src('test.js')
    .pipe(mocha({reporter: 'spec'}))
    .once('error', function(e) {
      console.log(e);
      process.exit(1);
    })
    .once('end', function() {
      process.exit(0);
    });
});

gulp.task('reset', function() {
  var config = require('./config.json');
  models.mongoose.connect(config.mongodb, function() {
    models.mongoose.connection.db.dropDatabase();
    rimraf.sync('data/*csv*')
    process.exit(0);
  });
});
