/**
 * The canonical production hosts. Analytics and session recording run only
 * here, so local dev, preview deploys and *.vercel.app aliases never reach the
 * real GA / Clarity properties.
 */
const PRODUCTION_HOSTS = new Set(["pushbundle.com", "www.pushbundle.com"]);

export function isProductionHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.has(hostname);
}
