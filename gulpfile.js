var fs = require('fs'),
    gulp = require("gulp"),
    rsync = require('gulp-rsync'),
    composer = require('gulp-composer'),
    sourcemaps = require('gulp-sourcemaps'),
    sass = require("gulp-sass"),
    autoprefixer = require('gulp-autoprefixer');

//************ CSS ************//

gulp.task('compile-css:dev', function () {
    gulp.src('./static/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./static/css/'));
});

gulp.task('compile-css', function () {
    gulp.src('./static/scss/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('./static/css/'));
});

//************ STAGING/PRODUCTION ************//

gulp.task('push-to-server', function () {
    gulp.src('./')
        .pipe(rsync({
            root: './',
            hostname: process.env.SSH_IP,
            username: process.env.SSH_USERNAME,
            destination: process.env.SSH_DESTINATION,
            recursive: true,
            emptyDirectories: true,
            clean: true,
            silent: true,
            exclude: [
                '.bowerrc',
                '.git',
                '.env',
                '.env-example',
                '.bower.json',
                'composer.*',
                'gulpfile.js',
                'package.json',
                'README.MD',
                '*.scss',
                './**/.cass-cache',
                'node_modules/**',
                'logs/**',
                'static/colorwheels/**',
                'static/projected_images/**',
                'static/videos/**'
            ]
        }));
});

//************ COMPOSER ************//

gulp.task("composer", function () {
    composer('install --no-dev', {async: false, "working-dir": "./"});
});

gulp.task("build", ['compile-css', 'composer']);

//************ DEV ************//
gulp.task('watch', ['compile-css:dev'], function () {
    gulp.watch('static/scss/**/*.scss', ['compile-css:dev']);
});