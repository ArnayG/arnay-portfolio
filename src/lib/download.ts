"use client";

/** Hands a generated file to the browser's own download machinery. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Revoking in the same task can cancel the download before it starts.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
