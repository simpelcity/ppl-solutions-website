import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: configDir,
  },
  sassOptions: {
    silenceDeprecations: [
      "color-functions",
      "global-builtin",
      "import"
    ],
  }
};

export default nextConfig;