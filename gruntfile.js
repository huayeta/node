module.exports=function(grunt){

//    grunt.loadNpmTasks('grunt-contrib-watch');
//    grunt.loadNpmTasks('grunt-nodemon');
//    grunt.loadNpmTasks('grunt-concurrent');
    require('load-grunt-tasks')(grunt);
    
    grunt.option('force',true);
    grunt.registerTask('default',['concurrent'])
    
}