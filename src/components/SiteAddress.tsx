"use client";

import { useSyncExternalStore } from "react";
import { site } from "@/data/site";

/** Nothing to subscribe to: the host can't change without a navigation. */
const subscribe = () => () => {};
const readHost = () => window.location.host.replace(/^www\./, "");
/** The server has no host to read, so the line fills in on hydration. */
const noHost = () => "";

/**
 * Where the card came from. `site.website` wins when it's set — use it to
 * show a tidier form than the raw host — and otherwise the live host fills
 * itself in, so the card is right in development and in production without a
 * domain written down anywhere.
 */
export default function SiteAddress({ className }: { className?: string }) {
  const live = useSyncExternalStore(subscribe, readHost, noHost);
  const address = site.website ?? live;
  if (!address) return null;
  return <span className={className}>{address}</span>;
}
