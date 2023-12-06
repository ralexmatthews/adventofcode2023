import fs from "node:fs";

const file = fs.readFileSync("./day5/challenge1/input.txt", "utf8").trim();

const [rawSeeds, ...rawTransforms] = file.split("\n\n");

const seedsValues = rawSeeds.split(":")[1].trim().split(" ").map(Number);

const transforms = rawTransforms
  .map((s) => s.trim())
  .map((category) => {
    const [, data] = category.split(":").map((v) => v.trim());
    const normalizedData = data
      .split("\n")
      .map((v) => v.trim())
      .map((datum) => datum.split(" ").map(Number))
      .map(([destinationRangeStart, sourceRangeStart, rangeLength]) => ({
        destinationRangeStart,
        sourceRangeStart,
        rangeLength,
      }));
    return normalizedData;
  });

let seeds = Object.fromEntries(seedsValues.map((v) => [v, v]));

transforms.forEach((mapping) => {
  let stageSeeds = { ...seeds };
  mapping.forEach(
    ({ destinationRangeStart, sourceRangeStart, rangeLength }) => {
      const newSeeds = Object.fromEntries(
        Object.entries(seeds)
          .filter(
            ([, destination]) =>
              sourceRangeStart <= destination &&
              destination < sourceRangeStart + rangeLength
          )
          .map(([seed, destination]) => [
            seed,
            destinationRangeStart + (destination - sourceRangeStart),
          ])
      );
      stageSeeds = { ...stageSeeds, ...newSeeds };
    }
  );
  seeds = stageSeeds;
});

console.log(Math.min(...Object.values(seeds)));
// console.log(mappedSeeds);
