import fs from "node:fs";

const file = fs.readFileSync("./day11/challenge1/input.txt", "utf8").trim();

const nonExpandedGalaxies = file.split("\n").map((v) => v.split(""));

const emptyRowIndexes = new Set(
  nonExpandedGalaxies
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v.every((v) => v === "."))
    .map(({ i }) => i)
);

const emptyColumnIndexes = new Set(
  nonExpandedGalaxies[0]
    .map((v, i) => ({ v, i }))
    .filter((_, i) => nonExpandedGalaxies.every((row) => row[i] === "."))
    .map(({ i }) => i)
);

const galaxiesWithExpandedRows = nonExpandedGalaxies
  .map((v, i) => (emptyRowIndexes.has(i) ? [v, v] : [v]))
  .flat();

const space = galaxiesWithExpandedRows.map((v, i) =>
  v.map((char, i) => (emptyColumnIndexes.has(i) ? [char, char] : [char])).flat()
);

const isValue = <A>(v: A | null | undefined): v is A =>
  v !== null && v !== undefined;

type Position = [row: number, column: number];

const indexesOfGalaxies = space
  .map((row, r) =>
    row
      .map((char, c) => (char === "#" ? ([r, c] as Position) : null))
      .filter(isValue)
  )
  .flat();

const getDistanceBetweenPoints = (p1: Position, p2: Position) => {
  const [r1, c1] = p1;
  const [r2, c2] = p2;

  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
};

const findAllDistances = () => {
  let distances = 0;

  indexesOfGalaxies.forEach((position, i) => {
    const otherPoints = indexesOfGalaxies.slice(i + 1);
    otherPoints.forEach((otherPosition) => {
      distances += getDistanceBetweenPoints(position, otherPosition);
    });
  });

  return distances;
};

console.log(findAllDistances());
