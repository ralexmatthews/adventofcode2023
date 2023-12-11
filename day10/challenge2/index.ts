import fs from "node:fs";
import { getPath } from "./path.js";
import { getNumberOfPointsInPath } from "./points.js";
import { PipePieces } from "./utils.js";

const file = fs.readFileSync("./day10/challenge2/input.txt", "utf8").trim();

const grid = file.split("\n").map((v) => v.split("") as PipePieces[]);

const findFarthestDistance = () => {
  const path = getPath(grid);

  const numberOfPointsInShape = getNumberOfPointsInPath(grid, path);

  console.log(numberOfPointsInShape);
};

findFarthestDistance();
