import { build, emptyDir } from "@deno/dnt";

await emptyDir("./dist");

const jsrJson = await Deno.readTextFile("./deno.json");
const config: { version: string } = JSON.parse(jsrJson);

await build({
  entryPoints: ["./index.ts"],
  outDir: "./dist",
  shims: {
    deno: true,
  },

  package: {
    // package.json properties
    name: "@nakanoasaservice/last-err",
    version: config.version,
    description: "Typing errors without custom error class.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git://github.com/nakanoasaservice/last-err.git",
    },
    bugs: {
      url: "https://github.com/nakanoasaservice/last-err/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});
