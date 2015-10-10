var gulp=require("gulp");
var combiner=require('stream-combiner2');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var rename=require('gulp-rename');
var del=require('del');
var browerSync=require('browser-sync');
var changed=require('gulp-changed');

var DEST='hua_build';

//清楚工作
gulp.task('clean',function(){
    del(DEST);
});

//监控文件变动自动刷新浏览器
gulp.task('serve',function(){
    browerSync({
        server:{
            baseDir:'app'
        }
    })
    gulp.watch(['public/js/*/*.js','views/*.htm'],{cwd:'app'},browerSync.reload);
});

//压缩重命名合并
gulp.task('default',['clean'],function(){
    var combined=combiner.obj([
        gulp.src('hua/*'),//读取数据
        changed(DEST),//提前知道哪些文件被修改过
        // gulp.dest(DEST),//源文件输出
        uglify(),//压缩
        rename({extname:'.min.js'}),
        // gulp.dest(DEST),
        concat('contat.min.js'),//合并数据
        gulp.dest(DEST)//输出数据
    ]);

    //任何在上面stream中发生的错误，都不回抛出，而是会被监听器捕获
    combined.on('error',console.log.bind(console));
    return combined;
});
