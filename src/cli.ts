import { Command } from "commander";
import { readFileSync, writeFileSync } from "node:fs";
import { parseDsl } from "./parser.js";
import { validate } from "./semantic.js";
import { renderSvg } from "./renderer.js";

const cli = new Command();
cli.argument("<input>").option("-o, --out <path>", "output path", "diagram.svg");
cli.action((input, opts) => {
  const src = readFileSync(input, "utf8");
  const ast = parseDsl(src);
  const errors = validate(ast);
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  writeFileSync(opts.out, renderSvg(ast), "utf8");
  console.log(`Rendered ${opts.out}`);
});
cli.parse();
