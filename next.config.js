/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
const secureHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },

  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },

  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

module.exports = {
  nextConfig,
  async headers() {
    return [{ source: "/:path", headers: secureHeaders }];
  },
};
