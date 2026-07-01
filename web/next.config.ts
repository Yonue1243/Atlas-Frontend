import { existsSync } from "fs";
import path from "path";
import type { NextConfig } from "next";

const monorepoRoot = path.join(__dirname, "../..");

const nextConfig: NextConfig = {
  // Solo en monorepo local (pnpm-workspace en la raíz). En Netlify (repo solo web) no aplica.
  ...(existsSync(path.join(monorepoRoot, "pnpm-workspace.yaml"))
    ? { outputFileTracingRoot: monorepoRoot }
    : {}),
};

export default nextConfig;
