var gulp=require("gulp");
var combiner=require('stream-combiner2');
var concat=require('gulp-concat');
var uglify=require('gulp-uglify');
var rename=require('gulp-rename');
var del=require('del');
var browerSync=require('browser-sync');
var changed=require('gulp-changed');
var jshint= require('gulp-jshint');
var shell=require('gulp-shell');
var babel=require('gulp-babel');
var sequence=require('gulp-sequence');//顺序or并行执行任务

// var DEST='hua_build';

//清楚工作
// gulp.task('clean',function(){
//     del(DEST);
// });

//shell任务
// gulp.task('shell',shell.task(['mongod --config /usr/local/etc/mongod.conf','supervisor -w config,app -i app/public,app/views  --harmony app']));

//监控文件变动自动刷新浏览器
// gulp.task('serve',function(){
//     browerSync({
//         server:{
//             baseDir:'app'
//         }
//     })
//     gulp.watch(['public/js/*/*.js','views/*.htm'],{cwd:'app'},browerSync.reload);
// });

//压缩重命名合并
// gulp.task('default',['clean'],function(){
//     var combined=combiner.obj([
//         gulp.src('hua/*.js'),//读取数据
//         changed(DEST),//提前知道哪些文件被修改过
//         // gulp.dest(DEST),//源文件输出
//         jshint(),
//         jshint.reporter('default'),
//         uglify(),//压缩
//         rename({extname:'.min.js'}),
//         // gulp.dest(DEST),
//         concat('contat.min.js'),//合并数据
//         gulp.dest(DEST)//输出数据
//     ]);
//
//     //任何在上面stream中发生的错误，都不回抛出，而是会被监听器捕获
//     combined.on('error',console.log.bind(console));
//     return combined;
// });

//babel
var BABELDEST='./app/public/js/build/';
var BABELSRC=['./app/public/js/*/*.es6','./app/public/js/*/*.jsx'];
gulp.task('clean:babel',function(cb){
    del(BABELDEST).then(function(paths){
        cb();
    });
});
gulp.task('babel',function(){
    var combined=combiner.obj([
        gulp.src(BABELSRC),
        changed(BABELDEST),
        babel(),
        uglify(),
        rename(function(path){
            path.extname='.min.js';
        }),
        gulp.dest(BABELDEST)
    ]);
    combined.on('error',console.log.bind(console));
    return combined;
});
gulp.task('w-babel',['babel'],function(){
    gulp.watch(BABELSRC,['babel']);
});
//default
gulp.task('build',sequence('clean:babel','w-babel'));
gulp.task('default',['build']);
