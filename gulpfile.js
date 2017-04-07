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
    uglify = require('gulp-uglify'),
    merge = require('merge-stream'),
    cleanCSS = require('gulp-clean-css'),
    babel = require('gulp-babel'),
    del = require('del');

// TODO consider if it's necessary to have multiple paired cleaning and building
// tasks and if the path names should be vars (since they get re-used).

// Helper function to ensure certain functions are only invoked in the production
// environment.
function productionOnly(fn) {
    return gutil.env.production ? fn() : gutil.noop();
}

// Helper function to ensure certain functions are only invoked in the development
// environment.
function devOnly(fn) {
    return gutil.env.dev ? gutil.noop() : fn();
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
    gulp.watch('src/assets/**/*', ['reload-assets']);
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

gulp.task('reload-all', ['build-js', 'bundle-css', 'copy-html', 'copy-assets'], function() {
    browserSync.reload();
    jshintHelper();
});


// Delete the distribution.
gulp.task('clean', function() {
    return del(['dist/*']);
});

// Specific cleaners
gulp.task('clean-html', function () {
    return del(['dist/**/*.html']);
});
gulp.task('clean-css', function () {
    return del(['dist/css/**/*']);
});
gulp.task('clean-js', function () {
    return del(['dist/js/**/*']);
});
gulp.task('clean-assets', function () {
  return del(['dist/assets/**/*']);
});

// no such file or directory, open '/home/oliver/Webdev/heroku/sample-sites/dist/assets/images/deck_builder_card_bg.png'


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
        .pipe(gulp.dest('dist/css'));
});

// Get the pre-processed scss, bundle it up with the existing css and add any
// mising prefixes.
gulp.task('bundle-css', ['clean-css'], function () {
 return merge(processScss(), gulp.src('src/css/**/*.css'))
    .pipe(autoprefixer())
    .pipe(concat('bundle.min.css'))
    .pipe(productionOnly(cleanCSS({compatibility: 'ie8'})))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('reload-js', ['build-js'], function () {
  browserSync.reload();
  jshintHelper();
})

// Bundle up and minify the javascript, including sourcemaps so that
// dev-tools can point you to the right js file.
gulp.task('build-js', ['clean-js'], function () {
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
        .pipe(gulp.dest('dist/js'));
});

gulp.task('reload-html', ['copy-html'], function () {
  browserSync.reload();
});

// At the moment this is pretty trivial, but it allows us to torch the entire
// contents of the dist directory when we clean.
gulp.task('copy-html', ['clean-html'], function () {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
});

gulp.task('reload-assets', ['copy-assets'], function () {
  browserSync.reload();
});

gulp.task('copy-assets', ['clean-assets'], function () {
  return gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets'))
});
