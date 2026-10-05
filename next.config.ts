import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/sanity/image-loader.ts",
  },
};

export default nextConfig;
