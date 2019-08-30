var autoprefixer = require('gulp-autoprefixer');
var beeper = require('beeper');
var browserSync = require('browser-sync');
var cache = require('gulp-cache');
var cleanCSS = require('gulp-clean-css');
var gconcat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var imagemin = require('gulp-imagemin');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
// var uncss              = require('gulp-uncss');
var postcss = require('gulp-postcss');
var uncss = require('postcss-uncss');
var csslint = require('gulp-csslint');
var sassLint = require('gulp-sass-lint');
var jshint = require('gulp-jshint');
var colorguard = require('gulp-colorguard');
// sudo npm install gulp-uglify browser-sync gulp-plumber gulp-autoprefixer gulp-sass gulp-pug gulp-imagemin gulp-cache gulp-clean-css gulp-sourcemaps gulp-concat beeper gulp-util gulp-rename gulp-notify --save-dev
var jsVendorFiles = ['src/js/plugins/*.js']; // Holds the js vendor files to be concatenated
var myJsFiles = ['src/js/*.js']; // Holds the js files to be concatenated
var fs = require('fs'); // ExistsSync var to check if font directory patch exist
var onError = function(err) { // Custom error msg with beep sound and text color
    notify.onError({
        title: "Gulp error in " + err.plugin,
        message: err.toString()
    })(err);
    beeper(3);
    this.emit('end');
    gutil.log(gutil.colors.red(err));
};


gulp.task('styles', function() {
    // var plugins = [
    //     uncss({
    //         ignore: [
    //             // /.js, .active, .selectric, .inactive/
    //             /.js/, /.active/, /.selectric/, /.inactive/, /.disable-scroll/, /.parsley/, /.mfp/, /.fadeIn/, /.fadeInLeft/, /.animated/, /.fadeInUp/, /.fadeOutDown/, /.fadeInDown/, /.trans-header/
    //         ],
    //         html: ['dist/**/*.html', 'dist/**/*.js'],

    //     }),
    // ];
    gulp.src('src/css/*.scss')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(sass({ indentedSyntax: true }))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS())
        // .pipe(postcss(plugins))
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'));
});

// lint sass
// gulp.task('sass-lint', function() {
//     return gulp.src([
//             'src/css/**/*.scss',
//         ])
//         .pipe(sassLint())
//         .pipe(sassLint.format())
//         .pipe(sassLint.failOnError())
// });

// pug -> html
gulp.task('templates', function() {
    gulp.src('src/*.pug')
        .pipe(plumber({ errorHandler: onError }))
        .pipe(pug())
        .pipe(gulp.dest('dist/'));
});

// concatenate multiple js files, minimise, conver to browser parsable js
gulp.task('scriptsConcat', function() {
    return gulp.src(myJsFiles.concat(jsVendorFiles))
        .pipe(plumber({ errorHandler: onError }))
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['env'] }))
        .pipe(gconcat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js'));
});

// use this if you dont want to concatenate all js files into one file
gulp.task('scripts', function() {
    return gulp.src('src/js/**/*.js')
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/js/'));
});

// Task: JSHint: linting js
// gulp.task('js-lint', function() {
//     gulp.src('src/js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });

// optimise images and copy from src to dist
gulp.task('images', function() {
    gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/img/'));
});

// copy fonts from src to dist
gulp.task("fonts", () =>
    gulp.src("src/fonts/**/*.*").pipe(gulp.dest("dist/fonts"))
);


gulp.task('watch', ['templates', 'scripts', 'styles', 'images', 'fonts'], function() {
    gulp.watch('src/css/**/*.scss', ['styles']);
    // gulp.watch('src/css/**/*.scss',                           ['sass-lint'])
    gulp.watch(['src/pug/**/*.pug', 'src/*.pug'], ['templates']);
    gulp.watch('src/js/**/*.js', ['scripts']);
    // gulp.watch('src/js/**/*.js',                              ['js-lint']);
    gulp.watch('src/img/**/*', ['images']);

    // init server
    browserSync.init({
        server: {
            proxy: "local.build",
            baseDir: "dist/",
            port: 3001
        }
    });

    gulp.watch(['dist/**'], browserSync.reload);
});

// gulp.task('build', ['templates', 'scripts', 'styles', 'images', 'fonts'], function() {
//     gulp.watch('src/css/**/*.scss', ['styles']);
//     // gulp.watch('src/css/**/*.scss',                           ['sass-lint'])
//     gulp.watch(['src/pug/**/*.pug', 'src/*.pug'], ['templates']);
//     gulp.watch('src/js/**/*.js', ['scripts']);
//     // gulp.watch('src/js/**/*.js',                              ['js-lint']);
//     gulp.watch('src/img/**/*', ['images']);
// });