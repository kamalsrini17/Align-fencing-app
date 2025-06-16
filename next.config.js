/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Disable webpack cache in development to prevent corruption
    if (dev) {
      config.cache = false;
    }
    
    // Optimize build performance
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    };

    return config;
  },
  // Disable SWC minification to prevent syntax errors
  swcMinify: false,
  // Enable strict mode
  reactStrictMode: true,
  // Disable source maps in production to reduce build size
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;