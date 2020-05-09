const fs = require('fs')
const gulp = require('gulp')
const gulpInject = require('gulp-inject')
const gulpSass = require('gulp-sass')
const gulpPostcss = require('gulp-postcss')
const gulpCssnano = require('gulp-cssnano')
const gulpBabel = require('gulp-babel')
const gulpUglify = require('gulp-uglify')
const gulpRename = require('gulp-rename')
const gulpClean = require('gulp-clean')
const gulpCopy = require('gulp-copy')
const gulpSourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload
const gulpIconfont = require('gulp-iconfont')
const gulpIconfontCss = require('gulp-iconfont-css')
const gulpTemplate = require('gulp-template')

gulpSass.compiler = require('node-sass')

function css() {
    return gulp
        .src(['src/scss/**/*.scss', '!src/scss/_variables.scss'])
        .pipe(gulpSourcemaps.init())
        .pipe(
            gulpSass
                .sync({
                    outputStyle: 'expanded',
                })
                .on('error', gulpSass.logError)
        )
        .pipe(
            gulpPostcss([
                require('precss'),
                require('postcss-import'),
                require('postcss-url'),
                require('postcss-cssnext'),
                require('postcss-px-to-viewport'),
                require('postcss-pxtorem'),
            ])
        )
        .pipe(gulpSourcemaps.write('./'))
        .pipe(gulp.dest('dist/css'))
        .pipe(reload({ stream: true }))
}
exports.css = css

function cssnano() {
    return gulp
        .src(['dist/css/*.css', '!dist/css/*.min.css'])
        .pipe(
            gulpRename({
                suffix: '.min',
                extname: '.css',
            })
        )
        .pipe(gulpCssnano())
        .pipe(gulp.dest('dist/css'))
}
exports.cssnano = cssnano

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

function compressJs() {
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
exports.compressJs = compressJs

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

function copyStatic() {
    return gulp
        .src(['static/**/*.*'])
        .pipe(gulpCopy('dist/'))
        .pipe(gulp.dest('dist'))
        .pipe(reload({ stream: true }))
}
exports.copyStatic = copyStatic

const watchs = () => {
    gulp.watch('src/**/*.js', js)
    gulp.watch('src/**/*.scss', css)
    gulp.watch('src/index.html', html)
    gulp.watch('src/icons/svg/*.svg', svgFont)
    gulp.watch('src/icons/example/index.html', makeExample)
    browserSync.init({
        server: {
            baseDir: 'dist/',
        },
    })
}
exports.watchs = watchs

function getIcons() {
    var icons = fs.readdirSync('src/icons/svg')
    icons = icons.map(function (icon) {
        return icon.replace('.svg', '')
    })
    return icons
}

function makeExample() {
    return gulp
        .src('src/icons/example/index.html')
        .pipe(
            gulpTemplate({
                icons: getIcons(),
            })
        )
        .pipe(gulp.dest('dist/fonts/'))
        .pipe(reload({ stream: true }))
}

function svgFont() {
    return gulp
        .src(['src/icons/svg/**/*.svg'])
        .pipe(
            gulpIconfontCss({
                fontName: 'iconfont',
                path: 'src/icons/template/iconfont.css',
                targetPath: '../css/iconfont.css',
                fontPath: '../fonts/',
            })
        )
        .pipe(
            gulpIconfont({
                fontName: 'iconfont', // required
                formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                timestamp: Math.round(Date.now() / 1000), // recommended to get consistent builds when watching files
            })
        )
        .on('glyphs', function (glyphs, options) {
            // CSS templating, e.g.
            console.log(glyphs, options)
        })
        .pipe(gulp.dest('dist/fonts/'))
        .pipe(reload({ stream: true }))
}
exports.svgFont = svgFont

function clean() {
    // 如果直接使用 'dist'，当dist目录不存在时，会出现一个bug
    return gulp.src(['dist/**/*.*', 'dist/**/*']).pipe(gulpClean({ force: true }))
}
exports.clean = clean

// 并发执行 js，css
exports.serve = gulp.series(gulp.parallel(copyStatic, js, css, svgFont), html, watchs)

// 并发执行 js，css
exports.build = gulp.series(clean, gulp.parallel(copyStatic, js, css, svgFont, makeExample), gulp.parallel(compressJs, cssnano), html)
