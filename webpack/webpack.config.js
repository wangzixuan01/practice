const  path  = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const Uglify = require("uglifyjs-webpack-plugin");
const glob = require('glob');
const  PurifyCSSPlugin = require("purifycss-webpack");
const  webpack = require("webpack");
const  CopyWebpackPlugin = require('copy-webpack-plugin');
const  entry = {
    entry:'./src/entry.js',
    jquery:'jquery'
};
module.exports = entry;
module.exports = {
    entry:{
        entry:"./src/index.js"
    },
    output:{
        path:path.resolve(__dirname,"dist"),
        filename:"[name].js"
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                // use:['style-loader','css-loader']
                // use:[
                //     {
                //         loader:'style-loader'
                //     },
                //     {
                //         loader:'css-loader'
                //     }
                // ]
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader:"css-loader",
                        options:{importLoaders:1}
                    },
                    "postcss-loader"
                    ]
                })
            },
            {
                test:/\.scss$/,
                // use:['style-loader','css-loader','sass-loader']
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader","sass-loader"]
                })
            }
        ]
    },
    plugins:[
    new HtmlWebpackPlugin({
            minify:{
                removeAttributeQuotes:true
            },
            hash:true,
            template: "./src/index.html"
        }),
    new ExtractTextPlugin('css/index.css'),
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname,'src/*.html')),
        }),
        new webpack.ProvidePlugin({
            $:"jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name:'jquery',
            filename:"assets/js/jquery.js",
            minChunks:2
        })
    ],
    devServer:{
        contentBase:path.resolve(__dirname,'dist'),
        host:'127.0.0.1',
        port:'8081',
        compress:true
    }
};