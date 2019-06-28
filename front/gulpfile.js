var gulp = require("gulp");
var cssnano = require("gulp-cssnano");//簡化css
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');//簡化js
var concat = require('gulp-concat');//合併文件
var imagemin = require('gulp-imagemin');//無損壓縮圖片
var cache = require('gulp-cache');//緩存壓縮過的文件
var bs = require("browser-sync").create();//開啟服務器
var sass = require("gulp-sass");
var util = require("gulp-util");//這個插件的log方法可打印出當前js錯誤信息
var sourcemaps = require("gulp-sourcemaps");//找到源js文件的錯誤位置

var path = {
    'html': './templates/**/',//**表示中間可有其他文件
    'css': './src/css/**/',
    'js': './src/js/',
    'images': './src/images/',
    'css_dist': './dist/css/',
    'js_dist': './dist/js/',
    'images_dist': './dist/images/',

}

gulp.task('html', function () {
    gulp.src(path.html + '*.html')
        .pipe(bs.stream())
})


//css task
// 定义一个处理css文件改动的任务
gulp.task("css", function () {
    gulp.src(path.css + "*.scss")
        .pipe(sass().on("error", sass.logError))
        .pipe(cssnano())//將上一個給果傳給參數
        .pipe(rename({"suffix": ".min"}))//index.css -> index.min.css
        .pipe(gulp.dest(path.css_dist))//dist目的地
        .pipe(bs.stream())//啟動瀏覽器自動更新功能

});

//簡化js
gulp.task('js', function () {
    gulp.src(path.js + '*.js')
        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", util.log))
        .pipe(rename({"suffix": ".min"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.js_dist))
        .pipe(bs.stream())//啟動瀏覽器自動更新功能

})
//壓縮圖片
gulp.task('images', function () {
    gulp.src(path.images + "*.*")
        .pipe(cache(imagemin()))
        .pipe(gulp.dest(path.images_dist))
        .pipe(bs.stream())//啟動瀏覽器自動更新功能

});

// 定义一个监听的任务
gulp.task("watch", function () {
    // 监听所有的css文件，然后执行css这个任务
    gulp.watch(path.html + '*.html', ['html']);
    gulp.watch(path.css + '*.scss', ['css']);
    gulp.watch(path.js + '*.js', ['js']);
    gulp.watch(path.images + '*.*', ['images']);
});

//瀏覽器自動更新功能
gulp.task("bs", function () {
    bs.init({
        'server': {
            'baseDir': './'
        }
    });
});

// gulp.task("default", ['bs', 'watch'])
gulp.task("default", ['watch'])