/* File: gulpfile.js */

// grab our packages
var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    gutil = require('gulp-util'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    rm = require('gulp-rimraf'),
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel');

// TODO consider if it's necessary to have multiple paired cleaning and building
// tasks and if the path names should be vars (since they get re-used).

// Helper function to ensure certain functions are only invoked in the production
// environment.
function productionOnly(fn) {
    return gutil.env.type === 'production' ? fn() : gutil.noop();
}

// Helper function to ensure certain functions are only invoked in the development
// environment.
function devOnly(fn) {
    return gutil.env.type === 'production' ? gutil.noop() : fn();
}

// define the default task and add the watch task to it
gulp.task('default', ['serve']);

// The reload-all task triggers the site building, starts up the reload server and
// starts watching for any changes to the source.
gulp.task('serve', ['reload-all'], function() {
    // Serve files from the dist directory
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch('src/js/**/*.js', ['reload-js']);
    gulp.watch('src/css/**/*.css', ['reload-css']);
    gulp.watch('src/scss/**/*.scss', ['reload-css']);
    gulp.watch('src/html/**/*.html', ['reload-html']);
});

function jshintHelper() {
   return gulp.src('src/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
}

// To make sure that the page reloads quickly, we don't want to waste time
// running jshint until the page has reloaded.  To achieve this we have to
// have reload as a dependency for any task invoking jshint... which is a
// little odd because the two things are entirely independent, but that's how
// Gulp works.

// Also, reload() ends up getting called before the server has started.
// Fortunately this is a no-op.

gulp.task('reload-all', ['build-js', 'bundle-css', 'copy-html'], function() {
    browserSync.reload();
    jshintHelper();
});



// Delete the distribution.
gulp.task('clean', function() {
    return gulp.src('dist/*').pipe(rm());
});

// Specific cleaners
gulp.task('clean-html', function () {
    return gulp.src('dist/**/*.html').pipe(rm());
});
gulp.task('clean-css', function () {
    return gulp.src('dist/assets/css/**/*').pipe(rm());
});
gulp.task('clean-css', function () {
    return gulp.src('dist/assets/js/**/*').pipe(rm());
});

// Pre-process the css.
function processScss () {
  return sass('src/scss/**/*.scss', {
          sourcemap: true
      })
      .on('error', sass.logError)
      .pipe(sourcemaps.write());
}



gulp.task('reload-css', ['bundle-css'], function () {
  browserSync.reload();
})

// Separate scss processing task.
gulp.task('build-scss', ['clean-css'], function () {
    return processScss()
        .pipe(gulp.dest('dist/assets/css'));
});

// Get the pre-processed scss, bundle it up with the existing css and add any
// mising prefixes.
gulp.task('bundle-css', ['clean-css'], function () {
  return merge(processScss(), gulp.src('src/css/**/*.css'))
    .pipe(autoprefixer())
    .pipe(concat('bundle.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('reload-js', ['build-js'], function () {
  browserSync.reload();
  jshintHelper();
})

// Bundle up and minify the javascript, including sourcemaps so that
// dev-tools can point you to the right js file.
gulp.task('build-js', ['clean'], function () {
    return gulp.src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('bundle.min.js'))
        // uglify cannot cope with es6 js, so we use babel to convert it first.
        .pipe(babel({
            presets: ['es2015']
        }))
        //only uglify if gulp is ran with '--type production'
        //.pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(uglify({
            compress: {
                pure_funcs: ['console.log'] // Tells uglify that console.log has
                // no side-effects and, since its result is never used, can be
                // safely deleted.
            }
        }))
        //.pipe(devOnly(uglify))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('reload-html', ['copy-html'], function () {
  browserSync.reload();
});

// At the moment this is pretty trivial, but it allows us to torch the entire
// contents of the dist directory when we clean.
gulp.task('copy-html', ['clean'], function () {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
});
