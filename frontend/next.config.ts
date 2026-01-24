import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'images.icon-icons.com',
      'icons.iconarchive.com',
      'encrypted-tbn0.gstatic.com',
      'placehold.co',
      'www.lewesac.co.uk',
      'tuyendung.kfcvietnam.com.vn',
      'via.placeholder.com',
      'img.freepik.com',
      'cdn-icons-png.freepik.com',
      'study4.com',
      'themewagon.github.io',
      'images.pexels.com',
      'cdn-icons-png.flaticon.com',
      'www.flaticon.com',
      'hips.hearstapps.com',
      'localhost',
    ],
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
