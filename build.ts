import { build, emptyDir } from "@deno/dnt";

await emptyDir("./dist");

interface Config {
  name: string;
  version: string;
  compilerOptions: { [key: string]: boolean };
}

const jsrJson = await Deno.readTextFile("./deno.json");
const config: Config = JSON.parse(jsrJson);

await build({
  entryPoints: ["./index.ts"],
  outDir: "./dist",
  shims: {
    deno: true,
  },

  compilerOptions: config.compilerOptions,

  package: {
    // package.json properties
    name: config.name,
    version: config.version,
    description: "Typing errors without custom error class.",
    license: "MIT",
    repository: {
      type: "git",
      url: "git://github.com/nakanoasaservice/tagged-error.git",
    },
    bugs: {
      url: "https://github.com/nakanoasaservice/tagged-error/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
    Deno.copyFileSync("README.md", "dist/README.md");
  },
});
