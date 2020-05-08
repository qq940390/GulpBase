const { src, dest, parallel, series, watch } = require('gulp')
const inject = require('gulp-inject')
const sass = require('gulp-sass')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const iconfont = require('gulp-iconfont')
const runTimestamp = Math.round(Date.now() / 1000)
const pipeline = require('readable-stream').pipeline

sass.compiler = require('node-sass')

function css() {
    return src(['src/scss/**/*.scss', '!src/scss/variables.scss'])
        .pipe(sourcemaps.init())
        .pipe(
            sass
                .sync({
                    outputStyle: 'expanded',
                })
                .on('error', sass.logError)
        )
        .pipe(sourcemaps.write('./'))
        .pipe(dest('dist/css'))
        .pipe(reload({ stream: true }))
}
exports.css = css

function js() {
    return src(['src/js/**/*.js'])
        .pipe(
            babel({
                presets: ['@babel/preset-env'],
            })
        )
        .pipe(dest('dist/js'))
        .pipe(reload({ stream: true }))
}
exports.js = js

function html() {
    return src('src/index.html')
        .pipe(
            inject(
                src('dist/**/*.js', {
                    read: false,
                }),
                {
                    ignorePath: ['dist/'], //去除tmp
                    addRootSlash: false, //去除/
                }
            )
        )
        .pipe(dest('dist'))
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
    return src(['static/svg/*.svg'])
        .pipe(
            iconfont({
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
        .pipe(dest('dist/static/fonts/'))
}

function compress() {
    return pipeline(src('lib/*.js'), uglify(), dest('dist'))
}

exports.serve = series(js, css, html, watchs)
