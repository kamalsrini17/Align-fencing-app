/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize memory usage and prevent DataView errors
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 1024000, // Increased from 244000 to 1MB to prevent memory issues
        cacheGroups: {
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
            maxSize: 1024000, // Increased from 244000 to 1MB
          },
        },
      },
    };

    // Reduce memory pressure
    if (dev) {
      config.cache = false;
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }

    return config;
  },
  // Disable SWC minification to prevent syntax errors
  swcMinify: false,
  // Enable strict mode
  reactStrictMode: true,
  // Disable source maps in production to reduce build size
  productionBrowserSourceMaps: false,
  // Reduce memory usage
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;