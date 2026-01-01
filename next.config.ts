import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image domains untuk Supabase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Untuk upload gambar
    },
  },
};

export default nextConfig;
