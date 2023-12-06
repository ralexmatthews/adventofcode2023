import fs from "node:fs";

// const file = fs.readFileSync("./day5/challenge2/test_input.txt", "utf8").trim();
const file = fs.readFileSync("./day5/challenge2/input.txt", "utf8").trim();

const [rawSeeds, ...rawTransforms] = file.split("\n\n");

const seedsValues = [...rawSeeds.split(":")[1].matchAll(/\d+ \d+/gim)]
  .map(([pairs]) => pairs.split(" ").map(Number))
  .map(([start, length]) => ({ start, length }));

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

let seeds = {};

const getOverlappingRange = (range1, range2) => {
  const lowerRange = range1.start < range2.start ? range1 : range2;
  const upperRange = range1.start >= range2.start ? range1 : range2;

  const lowerEnd = lowerRange.start + lowerRange.length;
  const upperEnd = upperRange.start + upperRange.length;

  if (lowerEnd > upperRange.start) {
    const arr = [];
    const end = Math.min(lowerEnd, upperEnd);
    for (let i = upperRange.start; i < end; i++) {
      arr.push(i);
    }
    return arr;
  }
};

transforms.forEach((mapping, m) => {
  // console.log(m);
  let stageSeeds = { ...seeds };
  mapping.forEach(
    ({ destinationRangeStart, sourceRangeStart, rangeLength }, r) => {
      // console.log("-", r);
      seedsValues.forEach(({ start, length }) => {
        const numbersWeCareAbout = getOverlappingRange(
          { start: sourceRangeStart, length: rangeLength },
          { start, length }
        );

        if (!numbersWeCareAbout) {
          return;
        }

        numbersWeCareAbout.forEach((numberWeCareAbout) => {
          const newNumberDestination =
            destinationRangeStart +
            ((stageSeeds[numberWeCareAbout] ?? numberWeCareAbout) -
              sourceRangeStart);

          if (newNumberDestination < 0) {
            console.log(
              stageSeeds[numberWeCareAbout] ?? numberWeCareAbout,
              sourceRangeStart
            );
          }

          stageSeeds[numberWeCareAbout] = newNumberDestination;
        });
      });
    }
  );
  seeds = { ...seeds, ...stageSeeds };
});

console.log(Math.min(...Object.values(seeds)));
// console.log(seeds);
