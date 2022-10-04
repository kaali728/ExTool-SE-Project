const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    loader: "akamai",
    path: "",
    domains: ["expert-tools-ca6e9.web.app", "firebasestorage.googleapis.com"],
  },
  trailingSlash: true,
};

module.exports = nextConfig;
