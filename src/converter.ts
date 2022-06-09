import { readFileSync, writeFileSync } from "fs";

const isG1Command = /^G1/;

const removeNonRequiredCommands = (lines: string[]): string[] => {
  const nonAcceptedCommandsRegex = /^[M|S|;]/;
  return lines.filter((line) => !nonAcceptedCommandsRegex.test(line));
};

const convertG1Command = (line: string) => {
  const regex = /([F|X|Y|Z])([\d|.]+)/g;
  const values = [];

  const groups = line.matchAll(regex);

  for (const group of groups) {
    const number = (parseFloat(group[2]) / 1000)
      .toFixed(15)
      .replace(/0+$/, "")
      .replace(/([0-9]+)\.$/, "$1.00000");
    values.push(`${group[1]}${number}`);
  }

  if (values.length === 0) {
    return line;
  }

  return `G1 ${values.join(" ")}`;
};

const convertLineValues = (lines: string[]) => {
  return lines.map((line) => {
    if (isG1Command.test(line)) {
      return convertG1Command(line);
    }
    return line;
  });
};

const addPsoCommands = (lines: string[]) => {
  const hasDepthValue = / [0-9].00000$/;

  return lines.reduce<string[]>((output, line, index) => {
    if (!isG1Command.test(line)) {
      return [...output, line];
    }

    const nextLine = lines[index + 1];

    if (!hasDepthValue.test(line) && hasDepthValue.test(nextLine)) {
      return [...output, line, "PSOCONTROL X ON"];
    }

    if (hasDepthValue.test(line) && !hasDepthValue.test(nextLine)) {
      return [...output, line, "PSOCONTROL X OFF"];
    }

    return [...output, line];
  }, []);
};

export const converter = (filepath: string) => {
  const input = readFileSync(filepath)
    .toString("utf-8")
    .replace(/\r\n/g, "\n")
    .split("\n");

  console.log(`Total lines to convert: ${input.length}`);

  console.log("- Removing non required commands");
  let output = removeNonRequiredCommands(input);
  console.log("- Adding Pso commands");
  output = addPsoCommands(output);
  console.log("- Converting values");
  output = convertLineValues(output);
  console.log(
    `Completed | Lines before: ${input.length} | Lines after: ${output.length}`
  );

  writeFileSync("converted_file.txt", output.join("\n"));
};
