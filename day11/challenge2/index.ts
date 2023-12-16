import fs from "node:fs";

const file = fs.readFileSync("./day11/challenge2/input.txt", "utf8").trim();

const space = file.split("\n").map((v) => v.split(""));

const emptyRowIndexes = new Set(
  space
    .map((v, i) => ({ v, i }))
    .filter(({ v }) => v.every((v) => v === "."))
    .map(({ i }) => i)
);

const emptyColumnIndexes = new Set(
  space[0]
    .map((v, i) => ({ v, i }))
    .filter((_, i) => space.every((row) => row[i] === "."))
    .map(({ i }) => i)
);

const isValue = <A>(v: A | null | undefined): v is A => v != null;

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

  const rDistance = Math.abs(r1 - r2);
  const cDistance = Math.abs(c1 - c2);

  const distance = rDistance + cDistance;

  const smallerR = Math.min(r1, r2);
  const numberOfEmptyRowsBetweenPoints = new Array(rDistance)
    .fill(0)
    .map((_, i) => i + smallerR)
    .filter((v) => emptyRowIndexes.has(v)).length;

  const smallerC = Math.min(c1, c2);
  const numberOfEmptyColsBetweenPoints = new Array(cDistance)
    .fill(0)
    .map((_, i) => i + smallerC)
    .filter((v) => emptyColumnIndexes.has(v)).length;

  const extraDistance =
    999_999 * (numberOfEmptyRowsBetweenPoints + numberOfEmptyColsBetweenPoints);

  return distance + extraDistance;
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
