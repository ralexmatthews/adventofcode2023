import fs from "node:fs";

const file = fs.readFileSync("./day8/challenge2/test_input.txt", "utf8").trim();

const [rawInstructions, rawPaths] = file.split("\n\n");

const instructions = rawInstructions.trim().split("");
const paths = Object.fromEntries(
  rawPaths
    .trim()
    .split("\n")
    .map((path) => {
      const [name, options] = path.split(" = ");
      const [L, R] = options
        .replace(/[()]/gim, "")
        .trim()
        .split(",")
        .map((v) => v.trim());
      return [name, { L, R }];
    })
);

const followPath = (currentPath, step) => {
  const path = paths[currentPath];
  const instruction = instructions[step % instructions.length];

  return path[instruction];
};

const calculateZs = (startPath) => {
  const zs = new Array(instructions.length).fill(0).reduce((acc, _, i) => {
    const lastPath = acc[i - 1] ?? startPath;
    return [...acc, followPath(lastPath, i)];
  }, []);

  return {
    paths: zs,
    stepsThatGiveZs: new Set(
      zs.map((v, i) => (v.endsWith("Z") ? i : null)).filter((v) => v !== null)
    ),
    endsUpAt: zs[zs.length - 1],
  };
};

const pathsZs = Object.fromEntries(
  Object.keys(paths).map((path) => [path, calculateZs(path)])
);

const findCycle = (path) => {
  let iteration = 0;
  /** @type {Set<number>[]} */
  const zs = [];
  /** @type {string} */
  let endsUpAt = path;
  /** @type {Record<string, number>} */
  const pathsSeen = {};
  while (true) {
    const nextIteration = pathsZs[endsUpAt];
    iteration++;
    zs.push(nextIteration.stepsThatGiveZs);

    if (pathsSeen[nextIteration.endsUpAt]) {
      return {
        zs,
        endsUpAt,
        cycleStartIteration: pathsSeen[nextIteration.endsUpAt],
        cycleEndIteration: iteration,
      };
    }
    pathsSeen[nextIteration.endsUpAt] = iteration;
    endsUpAt = nextIteration.endsUpAt;
  }
};

const pathsEndingInA = Object.keys(paths)
  .filter((v) => v.endsWith("A"))
  .map((path) => ({ path, cycles: findCycle(path) }));

// find the zs array number that all paths have, which would be gotten by
// looping through the zs starting from cycleStartIteration

// const intersection = (set1, set2) => {
//   const result = new Set();

//   for (const value of set1) {
//     if (set2.has(value)) {
//       result.add(value);
//     }
//   }

//   return result;
// };

// const allSet = new Set(new Array(instructions.length).fill(0).map((_, i) => i));

// const advanceLoop = ({ metaData }, iteration) => {
//   if (iteration < metaData.cycles.cycleEndIteration) {
//     return { metaData, currentZs: metaData.cycles.zs[iteration] };
//   }

//   const cycleLength =
//     metaData.cycles.cycleEndIteration - metaData.cycles.cycleStartIteration;
//   const offset = metaData.cycles.cycleStartIteration;

//   const index = offset + (iteration % cycleLength);

//   metaData.path === "22A" &&
//     console.log(cycleLength, offset, index, metadata.cycles.zs);

//   return {
//     metaData,
//     currentZs: metaData.cycles.zs[index],
//   };
// };

// const doWork = () => {
//   let iteration = 0;
//   let currentLoop = pathsEndingInA.map((metaData) => ({
//     metaData,
//     currentZs: metaData.cycles.zs[iteration],
//   }));

//   while (true) {
//     const commonZs = currentLoop.reduce(
//       (acc, { currentZs }) => intersection(acc, currentZs),
//       allSet
//     );

//     if (commonZs.size > 0) {
//       return iteration * instructions.length + Math.min(...commonZs) + 1;
//     }

//     iteration++;
//     currentLoop = currentLoop.map((v) => advanceLoop(v, iteration));
//   }
// };

// console.log(doWork());

const zsThatShareOccurrenceOfZAndIndexOfZ = pathsEndingInA.map((meta) => {
  const zs = meta.cycles.zs.map((z, i) => ({ z, i }));
  return {
    meta,
    i: zs
      .filter((z) =>
        pathsEndingInA.every((pathEndingInA) =>
          pathEndingInA.cycles.zs.some((thingZ) =>
            [...z.z].some((x) => thingZ.has(x))
          )
        )
      )
      .map((v) => v.i),
  };
});

console.log(zsThatShareOccurrenceOfZAndIndexOfZ.map((v) => v.meta.cycles));

// so now that we know what iterations the common occurrence could happen on, we
// need to do the math to figure out when the first time it could happen would
// be. We can do this by
