import { build, emptyDir } from "@deno/dnt";

await emptyDir("./dist");

interface Config {
  name: string;
  version: string;
  license: string;
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
    license: config.license,
    description:
      "A type-safe error handling solution without custom error classes.",
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
