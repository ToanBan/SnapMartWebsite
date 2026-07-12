const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.icon-icons.com' },
      { protocol: 'https', hostname: 'icons.iconarchive.com' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'www.lewesac.co.uk' },
      { protocol: 'https', hostname: 'tuyendung.kfcvietnam.com.vn' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'img.freepik.com' },
      { protocol: 'https', hostname: 'cdn-icons-png.freepik.com' },
      { protocol: 'https', hostname: 'study4.com' },
      { protocol: 'https', hostname: 'themewagon.github.io' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn-icons-png.flaticon.com' },
      { protocol: 'https', hostname: 'www.flaticon.com' },
      { protocol: 'https', hostname: 'hips.hearstapps.com' },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;