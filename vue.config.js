const path = require('path')
function resolve(dir) {
 return path.join(__dirname, dir)
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
    proxy: {
      '/api/': {
        target: 'http://admin.hangmaiyun360.com'
      },
      '/oss/': {
        target: 'http://admin.hangmaiyun360.com'
      },
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
};