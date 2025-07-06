/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // This is to suppress a benign warning from the 'handlebars' package, a dependency of genkit.
    // The package uses a deprecated feature not supported by webpack.
    config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /require.extensions/,
    ];
    return config;
  },
  allowedDevOrigins: [
    'https://6000-firebase-studio-1751734665003.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev',
    'https://9000-firebase-studio-1751734665003.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev'
  ],
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
