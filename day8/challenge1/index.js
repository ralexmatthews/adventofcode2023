import fs from "node:fs";

const file = fs.readFileSync("./day8/challenge1/input.txt", "utf8").trim();

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

const iterate = () => {
  let currentPath = "AAA";
  let step = 0;
  while (true) {
    const path = paths[currentPath];
    const instruction = instructions[step % instructions.length];

    const nextPath = path[instruction];

    if (nextPath === "ZZZ") {
      return step + 1;
    }

    currentPath = nextPath;
    step = step + 1;
  }
};

console.log(iterate());
