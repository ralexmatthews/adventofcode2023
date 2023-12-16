import fs from "node:fs";

const file = fs.readFileSync("./day12/challenge2/input.txt", "utf8").trim();

type SpringRecord = { springs: string; config: number[] };

const inputs: SpringRecord[] = file
  .split("\n")
  .map((line) => line.split(" "))
  .map(([springs, config]) => ({
    springs: new Array(5).fill(springs).join("?"),
    config: new Array(5).fill(config.split(",").map(Number)).flat(),
  }));

const foo = (
  { springs, config }: SpringRecord,
  springsLeft: string[],
  currentString: string
): number => {
  const [char, ...restOfSprings] = springsLeft;

  if (!char) {
    return isValidArrangement({ springs, config }, currentString) ? 1 : 0;
  }

  if (char === ".") {
    const newString = `${currentString}.`;
    const isValid = isPartiallyValidArrangement({ springs, config }, newString);
    return isValid ? foo({ springs, config }, restOfSprings, newString) : 0;
  }

  if (char === "#") {
    const newString = `${currentString}#`;
    const isValid = isPartiallyValidArrangement({ springs, config }, newString);
    return isValid ? foo({ springs, config }, restOfSprings, newString) : 0;
  }

  const newHashString = `${currentString}#`;
  const newDotString = `${currentString}.`;
  const isHashValid = isPartiallyValidArrangement(
    { springs, config },
    newHashString
  );
  const isDotValid = isPartiallyValidArrangement(
    { springs, config },
    newDotString
  );

  return (
    (isHashValid ? foo({ springs, config }, restOfSprings, newHashString) : 0) +
    (isDotValid ? foo({ springs, config }, restOfSprings, newDotString) : 0)
  );
};

const getNumberOfValidArrangements = ({
  springs,
  config,
}: SpringRecord): number => {
  const chars = springs.split("");

  return foo({ springs, config }, chars, "");
  // let arrangements = [""];

  // springs.split("").forEach((char) => {
  //   if (char === ".") {
  //     arrangements = arrangements.map((v) => `${v}.`);
  //   } else if (char === "#") {
  //     arrangements = arrangements.map((v) => `${v}#`);
  //   } else {
  //     arrangements = arrangements.map((v) => [`${v}#`, `${v}.`]).flat();
  //   }

  //   arrangements = arrangements.filter((a) =>
  //     isPartiallyValidArrangement({ springs, config }, a)
  //   );
  // });

  // return arrangements.filter((a) => isValidArrangement({ springs, config }, a))
  //   .length;
};

const arraysAreSame = <T>(arr1: T[], arr2: T[]) =>
  arr1.length === arr2.length &&
  arr1.every((item, index) => item === arr2[index]);

const getCorrectGroups = (config: number[]) => config.map((v) => "#".repeat(v));

const isPartiallyValidArrangement = (
  { config }: SpringRecord,
  arrangement: string
) => {
  const groups = arrangement
    .split(".")
    .filter(Boolean)
    .map((v) => v.length);

  if (groups.length < 1) {
    return true;
  }

  if (groups.length === 1 && groups[0] > config[0]) {
    return false;
  }

  if (groups.length > config.length) {
    return false;
  }

  if (groups.length === config.length && groups.at(-1)! > config.at(-1)!) {
    return false;
  }

  const completedGroups = groups.slice(0, -1);

  return arraysAreSame(
    completedGroups,
    config.slice(0, completedGroups.length)
  );
};

const isValidArrangement = ({ config }: SpringRecord, arrangement: string) => {
  const groups = arrangement.split(".").filter(Boolean);
  const correctConfig = getCorrectGroups(config);

  return arraysAreSame(groups, correctConfig);
};

let numberOfArrangements = 0;

process.stdout.write(`0.00%`);
for (let i = 0; i < inputs.length; i++) {
  numberOfArrangements += getNumberOfValidArrangements(inputs[i]);
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(`${(((i + 1) / inputs.length) * 100).toFixed(1)}%`);
}

process.stdout.clearLine(0);
process.stdout.cursorTo(0);
console.log(numberOfArrangements);
