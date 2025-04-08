import type { NextConfig } from "next";

const nextConfig = {
  images: {
      remotePatterns: [
          {
              protocol: "https",
              hostname: "i.pravatar.cc"
          },
          {
              protocol: "https",
              hostname: "res.cloudinary.com"
          },
      ]
      
  }
};

export default nextConfig;
