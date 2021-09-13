// module.exports =
// {
//     baseUrl: './', outputDir: 'tg', productionSourceMap: false, //关闭eslint 
//     lintOnSave: false, configureWebpack: config => {   // 开发环境和生产环境配置的区分
//         if (process.env.NODE_ENV === 'production') {
//             // 生产环境的配置
//             devtool: 'cheap-module-source-map';
//         } else {
//             // 其它环境的配置
//             devtool: 'source-map';
//         }
//     },
//     devServer: {
//         //端口号设置
//         port: 8888,
//         disableHostCheck: true,
//         proxy: {
//             '/api': {
//                 target: "http://192.168.0.128:8085",
//                 changeOrigin: true,
//                 pathRewrite: {
//                     "^/api": ""
//                 }
//             },
//         }
//     },
//     chainWebpack: config => {
//         rules: [
//             {
//                 test: /\.less$/,
//                 loader: "style-loader!css-loader!less-loader"
//             },
        
//         ]
//     }
// }