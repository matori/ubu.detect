gulp = require "gulp"
coffee = require "gulp-coffee"
gulpif = require "gulp-if"
util = require "gulp-util"
sourcemaps = require "gulp-sourcemaps"
stripDebug = require "gulp-strip-debug"
browserSync = require "browser-sync"
eslint = require "gulp-eslint"

mainFileName = "ubu.detect"
mainFilePath = "./src/#{mainFileName}.coffee"
distDir = "./dist"

isDev = true
isProduction = false

if util.env.production
    isDev = false
    isProduction = true

gulp.task "coffee", ->
    gulp.src mainFilePath
    .pipe gulpif isDev, sourcemaps.init()
    .pipe coffee {bare: false}
    .pipe gulpif isDev, sourcemaps.write()
    .pipe gulpif isProduction, stripDebug()
    .pipe gulp.dest distDir

gulp.task "lint", ->
    gulp.src "#{distDir}/#{mainFileName}.js"
    .pipe eslint {useEslintrc: true}
    .pipe eslint.format()
    .pipe eslint.failOnError()


gulp.task "bs", ->
    browserSync
        server:
            baseDir: "./"
        startPath: "./example"
        port: 8000
        open: true
        notify: false

gulp.task "bs-reload", ->
    browserSync.reload()

defaultTasks = ["coffee"]
if isDev
    defaultTasks.push "bs"
if isProduction
    defaultTasks.push "lint"

gulp.task "default", defaultTasks, ->
    if isDev
        gulp.watch mainFilePath, ["coffee", "bs-reload"]
        gulp.watch "./example/index.html", ["bs-reload"]

