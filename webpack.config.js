var webpack=require('webpack');
var path=require('path');

module.exports={
    entry:{
        jsx:'./webpack_demo/a'
    },
    output:{
        path:path.join(__dirname,'./app/public/js/'),
        filename:'b.js'
    },
    resolve:{
        extensions:['.jsx','.js']
    },
    module:{
        loaders:[
            {test:/\.[png|jpg]$/,loader:'url-loader?limit=8192'},
            { test: /\.css$/, loader: "style!css" }
        ]
    }
}
