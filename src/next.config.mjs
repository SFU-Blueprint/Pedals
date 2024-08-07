import startCronJob from "./cronJob.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      startCronJob();
    }
    return config;
  }
};

export default nextConfig;
