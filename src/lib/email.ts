import { site } from "@/data/site";

/* ── Address assembly ─────────────────────────────────────────────────────
   The address is stored rotated and split in site.ts and put back together
   here, in the browser. None of this is secrecy: it exists because address
   harvesters are overwhelmingly one HTTP fetch and one regular expression, so
   an address that is never a literal string in the HTML, the RSC payload or
   the JS bundle stays off their lists. A person reading the page still gets a
   normal clickable link, and anyone willing to run the page's JS still gets
   the address. The point is the cheap scrapers, not the determined ones.
   ──────────────────────────────────────────────────────────────────────── */

/** ROT13, which is its own inverse, so one function covers both directions. */
function rot13(value: string) {
  return value.replace(/[a-z]/gi, (char) => {
    const base = char < "a" ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

/**
 * Browser only. Rendering the result on the server puts the address straight
 * back into the markup and undoes the whole exercise.
 */
export function emailAddress() {
  const { user, host } = site.emailParts;
  return `${rot13(user)}@${rot13(host)}`;
}

/**
 * Length of the assembled address, the one thing about it that is safe to use
 * during a server render. In a monospace face it reserves the exact slot, so
 * the swap on hydration doesn't reflow anything around it.
 */
export const emailLength =
  site.emailParts.user.length + site.emailParts.host.length + 1;
