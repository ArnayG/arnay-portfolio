import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root so an unrelated lockfile elsewhere on the machine
    // can't be inferred as the project root.
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
