import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    silenceDeprecations: [
      "color-functions",
      "global-builtin",
      "import"
    ],
  }
};

export default nextConfig;
