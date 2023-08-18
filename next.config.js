/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        AUTH_HOST: process.env.AUTH_HOST,
        API_HOST: process.env.API_HOST,
    },
};

module.exports = nextConfig;