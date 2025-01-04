const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'i.giphy.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {ignoreBuildErrors: true},
  transpilePackages: ["@measured/puck", "lucide-react"],
  webpack: (config) => {
    config.externals.push({
      canvas: "canvas",
    });
    return config;
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:subdomain.localhost:3000',
  //       destination: '/en/site/:subdomain',
  //     },
  //     {
  //       source: '/:subdomain.localhost:3000/:path*',
  //       destination: '/en/site/:subdomain/:path*',
  //     },
  //   ];
  // },
};

module.exports = withNextIntl(nextConfig);
