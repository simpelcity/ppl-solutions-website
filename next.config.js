import path from "path";
import { fileURLToPath } from "url";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: configDir,
  },
  sassOptions: {
    loadPaths: [path.join(configDir, "node_modules/bootstrap/scss")],
    silenceDeprecations: [
      "color-functions",
      "global-builtin",
      "import"
    ],
  }
};

export default nextConfig;