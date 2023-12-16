import fs from "node:fs";

const file = fs.readFileSync("./day12/challenge1/input.txt", "utf8").trim();

type SpringRecord = { springs: string; config: number[] };

const inputs: SpringRecord[] = file
  .split("\n")
  .map((line) => line.split(" "))
  .map(([springs, config]) => ({
    springs,
    config: config.split(",").map(Number),
  }));

const generateArrangements = ({ springs }: SpringRecord): string[] => {
  let arrangements = [""];

  springs.split("").forEach((char) => {
    if (char === ".") {
      arrangements = arrangements.map((v) => `${v}.`);
    } else if (char === "#") {
      arrangements = arrangements.map((v) => `${v}#`);
    } else {
      arrangements = arrangements.map((v) => [`${v}#`, `${v}.`]).flat();
    }
  });
  return arrangements;
};

const isValidArrangement = ({ config }: SpringRecord, arrangement: string) => {
  const groups = arrangement.split(".").filter(Boolean);
  return (
    groups.length === config.length &&
    groups.map((v) => v.length).every((len, index) => len === config[index])
  );
};

const getNumberOfValidArrangements = (input: SpringRecord) =>
  generateArrangements(input).filter((arrangement) =>
    isValidArrangement(input, arrangement)
  ).length;

const sum = (a: number, b: number) => a + b;

const result = inputs.map(getNumberOfValidArrangements).reduce(sum, 0);

console.log(result);
