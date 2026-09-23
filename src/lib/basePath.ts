/**
 * Sub-path the site is served from, without a trailing slash ("" at a domain
 * root). next.config.ts reads this too, so the build and the asset URLs can't
 * drift apart.
 *
 * Next prefixes next/link hrefs and route URLs on its own, but not next/image
 * `src` or plain anchor hrefs, so anything pulled out of public/ has to go
 * through `asset()`.
 */
export const basePath = "/Arnay-Portfolio";

/** Points a public/ path at wherever the site is actually deployed. */
export function asset(path: string) {
  return `${basePath}${path}`;
}
