let gulp        = require('gulp'),
    browserSync = require('browser-sync').create(),  //живой релоад страницы
	csso        = require('gulp-csso'), 
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    del         = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin    = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant    = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache       = require('gulp-cache'), //библиотека кєшированния
    uglifyNew   = require('gulp-uglify-es').default,  // минификация js еs6, работает так себе
    notify      = require('gulp-notify'),   //обработчик ошибок
    plumber      = require('gulp-plumber'), //возвращает поток, и не делает ничего с данными
    autprefix   = require('gulp-autoprefixer');// Подключаем библиотеку для автоматического добавления префиксов
const reload      = browserSync.reload;

gulp.task('start', function () {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch("index.html").on('change', browserSync.reload);
})

gulp.task("js", function () {
    return gulp.src("src/js/script.js")
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
            return {
                tittle: 'js',
                message: err.message
                };
            })
        }))
        .pipe(concat('main_mini.js'))
        .pipe(uglifyNew(/* options */))
        .pipe(gulp.dest("./dist/js_mini"))
        .pipe(reload({stream: true}))
});

gulp.task('img', function () { 
    return gulp.src('src/img/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('./dist/img'))
        .pipe(reload ({stream: true}))
});

gulp.task('sass', function() { 
    return gulp
        .src("src/scss/main_style.scss")
        .pipe(plumber({
            errorHandler: notify.onError(function(err) {
            return {
                tittle: 'sass',
                message: err.message,
                templateOptions: {
                  }
                };
            })
        }))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autprefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) 
        .pipe(concat('mini_style.css'))
        .pipe(csso())
        .pipe(gulp.dest('./dist/css_mini'))
        .pipe(reload ({stream: true}))
});

gulp.task('clean', function() {
    return   del.sync(['./dist/img/*','./dist/js_mini/*','./dist/css_mini/*'], {force:true}); // Удаляем папку dist(кроме библиотек) перед сборкой,ОСТОРОЖНО я поставил форс, можно и винду удалить=)        
});

gulp.task('cleanOnlyCss', function() {
    return  del.sync(['dist/css_mini/*'], {force:true}); // Удаляем папку в dist со всем сss перед сборкой,ОСТОРОЖНО я поставил форс, можно и винду удалить=)        
});

gulp.task('clear', function (callback) {  //работает автономно, но если будут проблемы с картинками нужно запустить руками.
	return cache.clearAll();
})

gulp.task('watch', function() {
    gulp.watch('src/scss/**',function(event, cb) { // Наблюдение за sass файлами
        setTimeout(function(){gulp.start(['cleanOnlyCss','sass']);},500)});// нужен делей, потому как нужно расширить движок LibSass как в синхронном, так и асинхронном режиме.
	gulp.watch(['src/js/*.js', 'src/img/*'], ['build']); // Наблюдение за главным JS и img в файле разработки
});

gulp.task('build', ['clean','js','sass','img']);  //mini js,img and scss>css
gulp.task('dev', ['start','watch']);
