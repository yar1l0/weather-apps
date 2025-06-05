// types/next-pwa.d.ts
declare module "next-pwa" {
  import { NextConfig } from "next";

  type WithPWA = (nextConfig: NextConfig) => NextConfig;

  const withPWA: (options: {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: unknown[];
    buildExcludes?: (string | RegExp)[];
    fallbacks?: { [key: string]: string };
    [key: string]: unknown;
  }) => WithPWA;

  export default withPWA;
}
