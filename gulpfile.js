'use strict';

const port = '8888';
const path = './app';
const pathBuild = './build';

const gulp = require('gulp');
const rename = require('gulp-rename');
const notify = require("gulp-notify");
const notifier = require('node-notifier');
const connect = require('gulp-connect');

/* babel */
const babel = require('gulp-babel');
const jsmin = require('gulp-jsmin');


/* native build in single file */
const concat = require('gulp-concat');
// const autopolyfiller = require('gulp-autopolyfiller');




//html
gulp.task('html', function() {
  return gulp.src(`${ path }/**/*.html`)
    .pipe(gulp.dest(`${ pathBuild }/`))
    .pipe(connect.reload());
});

// scss
const sass = require('gulp-sass');

gulp.task('scss', () => {
  return gulp.src(`${ path }/scss/main.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(`${ pathBuild }/css/`))
    .pipe(connect.reload());
});


gulp.task('js-cache', () => {
  let isBabel = babel({
    presets: [require('babel-preset-es2015')]
  });

  isBabel.on('error', function(e) {
    console.log(e);
    isBabel.end();
    notifier.notify(`error JS: ${ e.message }`);
  });

  gulp.src(`${ path }/libs/cache/**/*.js`)
    .pipe(isBabel)
    .pipe(concat('cache.min.js'))
    // .pipe(autopolyfiller(`./js/autopolyfiller.js`, {
    //   browsers: ['last 2 version', 'ie 9']
    // }))
    // .pipe(jsmin())
    .pipe(rename({dirname: ''}))
    // .pipe(autopolyfiller(`./js/autopolyfiller.js`, {
    //   browsers: ['last 2 version', 'ie 9']
    // }))
    // .pipe(jsmin())
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(`${ pathBuild }/libs/js`))
    .pipe(connect.reload());
    // .pipe(open({uri: recacheURL}))
});


gulp.task('js', () => {
  let isBabel = babel({
    presets: [require('babel-preset-es2015')]
  });

  isBabel.on('error', function(e) {
    console.log(e);
    isBabel.end();
    notifier.notify(`error JS: ${ e.message }`);
  });

  gulp.src(`${ path }/js/**/*.js`)
    .pipe(isBabel)
    // .pipe(autopolyfiller(`./js/autopolyfiller.js`, {
    //   browsers: ['last 2 version', 'ie 9']
    // }))
    // .pipe(jsmin())
    // .pipe(autopolyfiller(`./js/autopolyfiller.js`, {
    //   browsers: ['last 2 version', 'ie 9']
    // }))
    // .pipe(jsmin())
    // .pipe(rename({dirname: ''}))
    .pipe(gulp.dest(`${ pathBuild }/js`))
    .pipe(connect.reload());
  // .pipe(open({uri: recacheURL}))
});


/* connect server */

gulp.task('connect', function() {
  connect.server({
    root: pathBuild,
    port: port,
    livereload: true
  });
});

/* watch */
gulp.task('watch', () => {
  gulp.watch([`${ path }/js/**/*`], ['js']);
  gulp.watch([`${ path }/libs/cache/**/*`], ['js-cache']);
  gulp.watch([`${ path }/**/*.scss`], ['scss']);
  gulp.watch([`${ path }/**/*.html`], ['html']);
});


/* default */
gulp.task('default', ['connect', 'html', 'js-cache', 'js', 'scss', 'watch']);
