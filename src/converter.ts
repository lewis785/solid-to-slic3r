import { readFileSync, writeFileSync } from "fs";

const removeNonRequiredCommands = (lines: string[]): string[] => {
  return lines.filter((line) => !/^[M|S|;]/.test(line));
};

const convertG1Command = (line: string) => {
  const regex = /([F|X|Y|Z])([\d|.]+)/g;
  const values = [];

  const groups = line.matchAll(regex);

  for (const group of groups) {
    const number = (parseFloat(group[2]) / 1000)
      .toPrecision(15)
      .replace(/0+$/, "");
    values.push(`${group[1]}${number}`);
  }

  if (values.length === 0) {
    return line;
  }

  return `G1 ${values.join(" ")}`;
};

const addPsoCommands = (lines: string[]) => {
  let psoOn = false;
  const isG1Command = /^G1/;
  const containsZeros = /0.00000/;

  return lines.reduce<string[]>((output, line, index) => {
    if (!isG1Command.test(line)) {
      return [...output, line];
    }

    if (!containsZeros.test(line) && containsZeros.test(lines[index + 1])) {
      return [...output, "PSOCONTROL X ON", line];
    }

    if (containsZeros.test(line) && !containsZeros.test(lines[index + 1])) {
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

  const output = addPsoCommands(removeNonRequiredCommands(input)).map(
    (line) => {
      if (/^G1/.test(line)) {
        return convertG1Command(line);
      }
      return line;
    }
  );

  writeFileSync("converted_file.txt", output.join("\n"));
};