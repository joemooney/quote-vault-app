
import type {NextConfig} from 'next';

// Manually load environment variables from .env.local.
// This is a robust workaround for environments where Next.js might not automatically pick up the file.
const dotenv = require('dotenv');
const result = dotenv.config({ path: './.env.local' });

if (result.error) {
  console.error('[Firebase Studio Debug] Error loading .env.local file:', result.error);
} else {
  console.log('[Firebase Studio Debug] Successfully loaded .env.local file. Keys found:', Object.keys(result.parsed || {}));
}

// Log the current working directory to debug .env.local file loading issues.
console.log(`\n[Firebase Studio Debug] CWD: ${process.cwd()}\n`);

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Other experimental features can go here
  },
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
    'https://9000-firebase-studio-1751734665003.cluster-3ch54x2epbcnetrm6ivbqqebjk.cloudworkstations.dev',
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
