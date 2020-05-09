const gulp = require('gulp')
const gulpInject = require('gulp-inject')
const gulpSass = require('gulp-sass')
const gulpBabel = require('gulp-babel')
const gulpUglify = require('gulp-uglify')
const gulpAutoprefixer = require('gulp-autoprefixer')
const gulpRename = require('gulp-rename')
const gulpClean = require('gulp-clean')
const gulpSourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const gulpIconfont = require('gulp-iconfont')
const runTimestamp = Math.round(Date.now() / 1000)

gulpSass.compiler = require('node-sass')

function css() {
    return gulp
        .src(['src/scss/**/*.scss', '!src/scss/variables.scss'])
        .pipe(gulpSourcemaps.init())
        .pipe(
            gulpSass
                .sync({
                    outputStyle: 'expanded',
                })
                .on('error', gulpSass.logError)
        )
        .pipe(gulpSourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({ stream: true }))
}
exports.css = css

function js() {
    return gulp
        .src(['src/js/**/*.js'])
        .pipe(
            gulpBabel({
                presets: ['@babel/preset-env'],
            })
        )
        .pipe(gulp.dest('dist/js'))
        .pipe(reload({ stream: true }))
}
exports.js = js

function html() {
    return gulp
        .src('src/index.html')
        .pipe(
            gulpInject(
                gulp.src(['dist/**/*.js', '!dist/**/*.min.js', 'dist/**/reset.css', 'dist/**/*!(reset).css', '!dist/**/*.min.css'], {
                    read: false,
                }),
                {
                    ignorePath: ['dist/'], //去除tmp
                    addRootSlash: false, //去除/
                }
            )
        )
        .pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }))
}
exports.html = html

const watchs = () => {
    watch('src/**/*.js', js)
    watch('src/**/*.scss', css)
    watch('src/index.html', html)
    //watch(['src/images/*.*', 'src/images/*/*.*'], images)
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
    })
}
exports.watchs = watchs

function makeIconfont() {
    return gulp
        .src(['src/svg/*.svg'])
        .pipe(
            gulpIconfont({
                fontName: 'gulp-static-font', // required
                prependUnicode: true, // recommended option
                formats: ['ttf', 'eot', 'woff'], // default, 'woff2' and 'svg' are available
                timestamp: runTimestamp, // recommended to get consistent builds when watching files
            })
        )
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options)
        })
        .pipe(gulp.dest('dist/fonts/'))
}

function clean() {
    return gulp.src('dist').pipe(gulpClean())
}
exports.clean = clean

function compress() {
    return gulp
        .src(['dist/**/*.js', '!dist/**/*.min.js'])
        .pipe(
            gulpRename({
                suffix: '.min',
                extname: '.js',
            })
        )
        .pipe(gulpUglify())
        .pipe(gulp.dest('dist'))
}
exports.compress = compress

exports.serve = gulp.series(js, css, html, watchs)

exports.build = gulp.series(clean, js, compress, css, html)
