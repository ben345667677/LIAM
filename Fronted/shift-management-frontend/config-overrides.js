module.exports = {
  devServer: function(configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      // Override proxy to use port 3000
      config.proxy = {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      };

      config.allowedHosts = 'all';
      return config;
    };
  },
};