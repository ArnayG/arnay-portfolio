"use client";

import { downloadBlob } from "@/lib/download";
import { vcardBlob, vcardFilename } from "@/lib/vcard";

/**
 * Hands over a vCard, which is the thing a business card is for. Phones open
 * the file straight into a "new contact" sheet, so there's no confirmation to
 * report back: the operating system takes it from here.
 */
export default function ContactButton() {
  return (
    <button
      type="button"
      onClick={() => downloadBlob(vcardBlob(), vcardFilename)}
      title="Download a contact card"
      className="inline-flex items-center gap-2 border border-rule px-3 py-2 font-mono text-[11px] tracking-[0.15em] text-ink-muted uppercase transition-colors hover:border-ink hover:text-ink"
    >
      Save contact
      <span aria-hidden="true" className="text-mark">
        [+]
      </span>
    </button>
  );
}
