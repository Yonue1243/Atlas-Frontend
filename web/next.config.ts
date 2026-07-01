import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El proyecto vive en un monorepo; fija la raíz para el tracing de archivos.
  outputFileTracingRoot: path.join(__dirname, "../.."),
};

export default nextConfig;
