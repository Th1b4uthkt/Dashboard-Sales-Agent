/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        canvas: false,
      };
    }
    return config;
  },
  images: {
    domains: ['flagcdn.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/retell/websocket/:callId',
        destination: '/api/retell/websocket/:callId',
      },
    ];
  },
};

export default nextConfig;
