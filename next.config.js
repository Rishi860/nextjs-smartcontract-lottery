/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = { nextConfig, images: { loader: "custom" } }; // this fixes the issue with yarn next export which ensures we can deploy completely static site
