"use client";

import { useSyncExternalStore } from "react";
import { emailAddress, emailLength } from "@/lib/email";

/** Nothing to subscribe to: once the browser has the address it is fixed. */
const subscribe = () => () => {};
const serverSnapshot = () => null;

/**
 * The address, assembled on the client so the server never sends it. Until
 * that happens the link reads "Email" in a slot the width of the real thing,
 * which keeps the swap from shifting the layout.
 */
export default function EmailLink({ className }: { className?: string }) {
  const address = useSyncExternalStore(subscribe, emailAddress, serverSnapshot);

  return (
    <a href={address ? `mailto:${address}` : undefined} className={className}>
      <span className="inline-block" style={{ minWidth: `${emailLength}ch` }}>
        {address ?? "Email"}
      </span>
    </a>
  );
}
