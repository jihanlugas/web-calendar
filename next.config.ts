import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env: {
    APP_NAME: process.env.APP_NAME,
    COOKIE_NAME: process.env.COOKIE_NAME,
    API_END_POINT: process.env.API_END_POINT,
    REFRESH_TOKEN_MINUTES: process.env.REFRESH_TOKEN_MINUTES,
  },
};

export default nextConfig;
