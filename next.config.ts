import type {
  NextConfig,
} from 'next';

const nextConfig: NextConfig = {
  /*
   * WhatsApp expects Open Graph metadata to be
   * available in the document head when crawling
   * a shared Hadiyad link.
   *
   * Normal visitors keep Next.js streaming behavior.
   * Only WhatsApp receives blocking metadata.
   */
  htmlLimitedBots:
    /WhatsApp/i,
};

export default nextConfig;