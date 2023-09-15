module.exports = {
    lintOnSave: false,
    devServer: {
      proxy: {
        '/apis': {
            target: 'https://www.apple.com.cn/',  //要解决跨域的接口的域名
            secure:false,           //如果是https接口，需要配置这个参数
            changeOrigin: true,  // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {
              '^/apis': '',  // 路径重写
              '^/js/apis': ''
            }
        },
        // '/js/apis':{
        //   target: 'https://www.apple.com.cn/',  //要解决跨域的接口的域名
        //   secure:false,           //如果是https接口，需要配置这个参数
        //   changeOrigin: true,  // 如果接口跨域，需要进行这个参数配置
        //   pathRewrite: {
        //     '^/apis': '',  // 路径重写
        //     '^/js/apis': ''
        //   }
        // }
    }
  },
  chainWebpack(config) {
    config.module
      .rule('worker')
      .test(/\.worker\.js$/)
      .use('worker-loader')
      .loader('worker-loader')
      .end();
    config.module.rule('js').exclude.add(/\.worker\.js$/)
  }
}
