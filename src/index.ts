#!/usr/bin/env node

import yargs from "yargs";
import { converter } from "./converter";

interface Arguments {
  file: string;
}

const arg = yargs
  .usage("Usage: $0 -f test_file.gcode")
  .option("file", {
    alias: "f",
    type: "string",
    describe: "path to file",
    demandOption: true,
  })
  .help()
  .alias("help", "help")
  .parseSync();

converter(arg.file);
