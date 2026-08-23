const localApiUrl = 'http://localhost:4000';
const legacyPublicHostname = 'chittalk-web-production\\.up\\.railway\\.app';
const canonicalPublicOrigin = 'https://chittalk.itscool.in';

const getApiImagePattern = () => {
  let apiUrl;

  try {
    apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || localApiUrl);
  } catch {
    apiUrl = new URL(localApiUrl);
  }

  if (apiUrl.protocol !== 'http:' && apiUrl.protocol !== 'https:') {
    apiUrl = new URL(localApiUrl);
  }

  return {
    protocol: apiUrl.protocol.slice(0, -1),
    hostname: apiUrl.hostname,
    port: apiUrl.port,
    pathname: '/**',
  };
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [getApiImagePattern()],
  },
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: legacyPublicHostname,
          },
        ],
        destination: `${canonicalPublicOrigin}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
  
