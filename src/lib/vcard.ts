"use client";

import { site } from "@/data/site";

/* ── Add to contacts ──────────────────────────────────────────────────────
   What a business card is actually for. vCard 3.0 is the version Contacts,
   Google and Outlook all read; 4.0 is newer but less widely handled.
   ──────────────────────────────────────────────────────────────────────── */

/** Escapes the characters vCard reads as structure rather than content. */
function esc(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/([;,])/g, "\\$1")
    .replace(/\n/g, "\\n");
}

function homepage() {
  return site.website ? `https://${site.website}` : window.location.origin;
}

export function buildVCard(): string {
  // "Student @ Stanford" carries both a title and an organisation.
  const [title, org] = site.role.split("@").map((part) => part.trim());
  const [locality, region] = site.location.split(",").map((part) => part.trim());

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${esc(site.lastName)};${esc(site.firstName)};;;`,
    `FN:${esc(`${site.firstName} ${site.lastName}`)}`,
    `EMAIL;TYPE=INTERNET,PREF:${esc(site.email)}`,
    title ? `TITLE:${esc(title)}` : "",
    org ? `ORG:${esc(org)}` : "",
    locality ? `ADR;TYPE=HOME:;;;${esc(locality)};${esc(region ?? "")};;` : "",
    `URL:${esc(homepage())}`,
    ...site.socials.map((social) => `URL:${esc(social.href)}`),
    `NOTE:${esc(site.cardline)}`,
    `REV:${new Date().toISOString()}`,
    "END:VCARD",
  ].filter((line) => line !== "");

  // CRLF is what the spec asks for, and some parsers hold it to that.
  return `${lines.join("\r\n")}\r\n`;
}

export const vcardFilename = `${site.firstName}-${site.lastName}`.toLowerCase().concat(".vcf");

export function vcardBlob() {
  return new Blob([buildVCard()], { type: "text/vcard;charset=utf-8" });
}
