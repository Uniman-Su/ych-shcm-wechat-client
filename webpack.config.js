var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');//将你的行内样式提取到单独的css文件里，
var HtmlWebpackPlugin = require('html-webpack-plugin'); //html模板生成器
var CleanPlugin = require('clean-webpack-plugin'); // 文件夹清除工具
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 文件拷贝
var OpenBrowser = require('open-browser-webpack-plugin');
var config = {
	entry:'',
	output: {
		path: path.join(__dirname, 'dist'), //打包后生成的目录
		publicPath: '',	//模板、样式、脚本、图片等资源对应的server上的路径
		filename: 'js/[name].[hash:6].js',	//根据对应入口名称，生成对应js名称
		chunkFilename: 'js/[id].chunk.js'   //chunk生成的配置
	},
	resolve: {
		root: [],
         //设置require或import的时候可以不需要带后缀
        extensions: ['', '.js', '.less', '.css']
    },
    /*devtool:'source-map',*/
	module: {
		loaders: [ 
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract('style', 'css')
			},
			{
				test: /\.less$/,
				loader: ExtractTextPlugin.extract('css!less')
			},
			{
				test: /\.js$/,
		        loader: 'babel',
		        exclude: /node_modules/,
		        query:{
		        	presets: ['es2015']
		        }
		    },
			{
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'file-loader?name=./fonts/[name].[ext]'
			},
			{
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'url',
                query: {
                    limit: 5120, //30kb 图片转base64。设置图片大小，小于此数则转换。
                    name: '../images/[name].[ext]?' //输出目录以及名称
                }
            }
		]
	},
	plugins: [
		new OpenBrowser({
			url:'http://localhost:8080'
		}),
		new webpack.ProvidePlugin({ //全局配置加载
           $: "jquery",
           jQuery: "jquery",
           "window.jQuery": "jquery"
        }),
        new CleanPlugin(['dist']),// 清空dist文件夹
		new webpack.optimize.CommonsChunkPlugin({
			name: 'common', // 将公共模块提取，生成名为`vendors`的chunk
			minChunks: 15 // 提取至少3个模块共有的部分
		}),
		new ExtractTextPlugin( "css/[name].[hash:6].css"), //提取CSS行内样式，转化为link引入
		new webpack.optimize.UglifyJsPlugin({ // js压缩
	      compress: {
	        warnings: false
	      }
	    }),
	    new CopyWebpackPlugin([
            {from: './src/images', to: './images'} //拷贝图片
        ])
	],
	externals: {
        $: 'jQuery'
    },
    //devtool: '#source-map',
	//使用webpack-dev-server服务器，提高开发效率
	devServer: {
		// contentBase: './',
		host: 'localhost',
		port: 8080, //端口
		inline: true,
		hot: false,
	}
};

module.exports = config;


//按文件名来获取入口文件（即需要生成的模板文件数量）
function getEntry(globPath) {
    var files = glob.sync(globPath);//glob.sync()方法获取与'./src/*.html'相匹配的列表
    var entries = {},
        entry,dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];//获取到的单独的列表，如'./src/index.html'    
        dirname = path.dirname(entry);//path.dirname()方法获取路劲中代表文件夹的部分，如'./src'
        extname = path.extname(entry);//path.extname()方法获取后缀名，如'.html'
        basename = path.basename(entry, extname);//path.basename()方法获取路劲中的最后一部分，如index
        entries[basename] = dirname +'/js/'+ basename+'.js'; //赋值给对象,这里对象的值根据自己的目录结构拼接
    }
    //封装后的entries对象如下,直接用于enrty入口
    /*{
      'about': './src/js/about.js',
	  'index': './src/js/index.js',
	  'list': './src/js/list.js' 
	  }*/
    return entries;
}
var entries = getEntry('./src/*.html');//'./src/*.html'表示src文件夹下面的所有html文件
config.entry = entries;//赋值给入口
var pages = Object.keys(entries);//Object.keys()获取对象的key ,

//生成HTML模板
pages.forEach(function(pathname) {
    var conf = {
        filename: pathname + '.html', //生成的html存放路径，相对于path
        template: './src/'+pathname + '.html', //html模板路径
        inject: true, //允许插件修改哪些内容，包括head与body
        hash: false, //是否添加hash值
        minify: { //压缩HTML文件
            removeComments: true,//移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    };
	conf.chunks = ['common', pathname]//需要引入的chunk，不配置就会引入所有页面的资源
    config.plugins.push(new HtmlWebpackPlugin(conf));
});
