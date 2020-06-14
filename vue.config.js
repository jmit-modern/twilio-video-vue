module.exports = {
    chainWebpack: config => {
      // remove vue-cli-service's progress output
      config.plugins.delete('progress')
    },
    devServer: {
      open: process.platform === 'darwin',
      host: 'localhost',
      port: 3000, // CHANGE YOUR PORT HERE!
      https: false,
      hotOnly: false,
      proxy: 'http://localhost:8000'
    }
  }