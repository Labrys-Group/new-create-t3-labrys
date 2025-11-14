import type { UserConfig } from "vitest/config";

export default {
  test: {
    globals: true,
    environment: "node",
  },
} satisfies UserConfig;
