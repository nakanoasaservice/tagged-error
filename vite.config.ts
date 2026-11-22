import { readFileSync, writeFileSync } from "node:fs";
import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    entry: ["index.ts"],
    format: ["esm", "cjs"],
    platform: "neutral",
    target: "es2022",
    dts: true,
    hooks: {
      "build:prepare"() {
        // Keep npm and JSR metadata in sync without requiring Deno.
        const { name, version, license } = JSON.parse(
          readFileSync("package.json", "utf8"),
        );
        writeFileSync(
          "jsr.json",
          JSON.stringify(
            {
              name,
              version,
              license,
              exports: "./index.ts",
              publish: { include: ["index.ts", "LICENSE", "README.md"] },
            },
            null,
            2,
          ) + "\n",
        );
      },
    },
  },
  test: { typecheck: { include: ["index.test.ts"] } },
  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ["dist/**"],
  },
  fmt: {
    printWidth: 80,
    ignorePatterns: ["dist/**", "jsr.json", "pnpm-lock.yaml"],
  },
});
