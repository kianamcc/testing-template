import { portalsViteConfig } from "vite-config";
import { mergeConfig } from "vitest/config";
import path from "path";

export default mergeConfig(portalsViteConfig, {
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
  resolve: {
    alias: [
      // mapping packages in monorepo to make vite use sources directly avoiding build step
      {
        find: /portals-base(?!\/src\/style\/)/,
        replacement: path.resolve(__dirname, "../portals-base/src"),
      },
    ],
  },
});
