'use strict';

const port = '8888';
const path = './app';
const pathBuild = './build';

const gulp = require('gulp');
const rename = require('gulp-rename');
const notify = require("gulp-notify");
const notifier = require('node-notifier');
const connect = require('gulp-connect');


const babel = require('gulp-babel');
const jsmin = require('gulp-jsmin');
const concat = require('gulp-concat');




/*
 *   html
 */

gulp.task('html', () => {
  return gulp.src(`${ path }/**/*.html`)
    .pipe(gulp.dest(`${ pathBuild }/`))
    .pipe(connect.reload());
});


/*
 *   scss
 */

const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

gulp.task('scss', () => {
  return gulp.src(`${ path }/scss/main.scss`)
    .pipe(sass().on('error', notify.onError( function (error) {
      return "Compile Error: " + error.message;
    })))
    .pipe(autoprefixer({
      browsers: ['> 1%', 'IE 10']
    }))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(`${ pathBuild }/css/`))
    .pipe(connect.reload());
});


/*
*    js-lint
*/

const eslint = require('gulp-eslint');

gulp.task('js-lint', () => {
  return gulp.src([`${ path }/js/**/*.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/*
 *   js-storage
 */

gulp.task('js-storage', ['js-lint'], () => {
  let isBabel = babel({
    presets: [require('babel-preset-es2015')]
  });

  isBabel.on('error', function(e) {
    console.log(e);
    isBabel.end();
    notifier.notify(`error JS: ${ e.message }`);
  });

  gulp.src(`${ path }/libs/storage/**/*.js`)
    .pipe(isBabel)
    .pipe(concat('storage.min.js'))
    .pipe(rename({dirname: ''}))
    .pipe(jsmin())
    .pipe(gulp.dest(`${ pathBuild }/libs/js`))
    .pipe(connect.reload());
});


/*
*   js
*/

gulp.task('js', ['js-lint'], () => {
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
    .pipe(rename({suffix: '.min'}))
    .pipe(jsmin())
    .pipe(gulp.dest(`${ pathBuild }/js`))
    .pipe(connect.reload());
});


/*
*   js-libs
*/

gulp.task('js-libs', () => {
  let isBabel = babel({
    presets: [require('babel-preset-es2015')]
  });

  isBabel.on('error', function(e) {
    console.log(e);
    isBabel.end();
    notifier.notify(`error JS: ${ e.message }`);
  });

  gulp.src(`${ path }/libs/js/**/*.js`)
    .pipe(isBabel)
    .pipe(rename({dirname: '', suffix: '.min'}))
    .pipe(jsmin())
    .pipe(gulp.dest(`${ pathBuild }/libs/js`))
    .pipe(connect.reload());
});


/*
*   connect server
*/

gulp.task('connect', () => {
  connect.server({
    root: pathBuild,
    port: port,
    livereload: true
  });
});


/*
*   watch
*/

gulp.task('watch', () => {
  gulp.watch([`${ path }/js/**/*`], ['js']);
  gulp.watch([`${ path }/libs/cache/**/*`], ['js-storage']);
  gulp.watch([`${ path }/**/*.scss`], ['scss']);
  gulp.watch([`${ path }/**/*.html`], ['html']);
});


/* default */
gulp.task('default', ['connect', 'js-libs', 'html', 'js-storage', 'js', 'scss', 'watch']);
