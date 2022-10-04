/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    loader: "akamai",
    path: "",
    domains: ["expert-tools-ca6e9.web.app", "firebasestorage.googleapis.com"],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
