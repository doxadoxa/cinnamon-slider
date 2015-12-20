var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    bower = require('gulp-bower');
    del = require('del');
    jade = require('gulp-jade'),
    plumber = require('gulp-plumber');

var config = {
  distPath : 'dist',
  srcPath : 'src',
  src : {
    styles : 'src/styles/**/*.scss',
    jade : 'src/templates/**/*.jade',
    scripts : 'src/js/*.js',
    jquery : 'bower_components/jquery/dist/**'
  },
  dist : {
    styles : 'dist/css',
    jade : "dist/demo",
    scripts : 'dist/js',
    jquery : 'dist/js'
  }
};

gulp.task('styles', function() {
  return gulp.src( config.src.styles )
    .pipe(plumber())
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
      .pipe(gulp.dest( config.dist.styles ))
      .pipe(rename({suffix: '.min'}))
      .pipe(minifycss())
      .pipe(gulp.dest( config.dist.styles ))
      .pipe(notify({ message: 'Styles task complete!' }));
});

gulp.task('templates', function() {
  return gulp.src( config.src.jade )
    .pipe(plumber())
    .pipe(jade({
      pretty: true,
      self: true
    }))
    .pipe(gulp.dest( config.dist.jade ))
    .pipe(notify({ message: 'Templates task complete!'}));
});

gulp.task('scripts', function() {
  return gulp.src( config.src.scripts )
    .pipe(plumber())
    .pipe( jshint.reporter('default') )
    .pipe( gulp.dest( config.dist.scripts ) )
    .pipe( rename({suffix: '.min'}) )
    .pipe( uglify() )
    .pipe( gulp.dest( config.dist.scripts ) )
    .pipe( notify({ message: 'Scripts task complete!' }) );
});


gulp.task('bower', function() {
  return bower();
});

gulp.task('jquery', function() {
  return gulp.src( config.src.jquery )
      .pipe( gulp.dest( config.dist.jquery ))
      .pipe( notify( { message: 'Jquery transfered!'}));
});

// Clean task
gulp.task('clean', function(cb) {
    del([ config.dist.styles, config.dist.scripts, config.dist + '/*.html'], cb)
});

// Default task, run with gulp
gulp.task('default', ['clean'], function() {
    gulp.start( 'bower', 'jquery', 'styles', 'templates', 'scripts');
});

// Watcher task
gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch( config.src.styles, ['styles']);
  // Watch .js files
  gulp.watch( config.src.scripts, ['scripts']);
  // Watch jade files
  gulp.watch( config.src.jade, ['templates']);
});
