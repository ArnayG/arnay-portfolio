import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";
import { basePath } from "./src/lib/basePath";

const nextConfig: NextConfig = {
  // Emit a plain HTML/CSS/JS bundle into `out/` for static hosting (cPanel).
  output: "export",
  // The site answers under a folder, not at the domain root.
  basePath,
  // Write `/index.html` per route so Apache serves clean URLs without rewrites.
  trailingSlash: true,
  // There's no Next image server on shared hosting, so ship the files as-is.
  images: { unoptimized: true },
  turbopack: {
    // Pin the workspace root so an unrelated lockfile elsewhere on the machine
    // can't be inferred as the project root.
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
