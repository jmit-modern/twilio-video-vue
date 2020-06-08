module.exports = {
    chainWebpack: config => {
      // remove vue-cli-service's progress output
      config.plugins.delete('progress')
    },
    devServer: {
      open: process.platform === 'darwin',
      host: '0.0.0.0',
      port: 8080, // CHANGE YOUR PORT HERE!
      https: true,
      hotOnly: false,
    }
  }