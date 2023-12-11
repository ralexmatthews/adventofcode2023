import fs from "node:fs";

const file = fs.readFileSync("./day10/challenge1/input.txt", "utf8").trim();

enum PipePieces {
  Nothing = ".",
  Horizontal = "-",
  Vertical = "|",
  BottomLeft = "7",
  BottomRight = "F",
  TopLeft = "J",
  TopRight = "L",
  Animal = "S",
}

const grid = file.split("\n").map((v) => v.split("") as PipePieces[]);

const FURTHEST_RIGHT = grid[0].length - 1;
const FURTHEST_DOWN = grid.length - 1;

type Position = [row: number, column: number];

const getPipeAt = ([row, column]: Position) => grid[row][column];

const moveUp = ([row, column]: Position): Position => [row - 1, column];
const moveLeft = ([row, column]: Position): Position => [row, column - 1];
const moveRight = ([row, column]: Position): Position => [row, column + 1];
const moveDown = ([row, column]: Position): Position => [row + 1, column];

const isSamePosition = (posA: Position, posB: Position) =>
  posA[0] === posB[0] && posA[1] === posB[1];

const canMoveUp = (position: Position, lastPosition: Position) => {
  const [row] = position;
  const nextPosition = moveUp(position);
  return (
    row !== 0 &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Vertical,
      PipePieces.TopLeft,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(position)) &&
    [
      PipePieces.Vertical,
      PipePieces.BottomLeft,
      PipePieces.BottomRight,
      PipePieces.Animal,
    ].includes(getPipeAt(nextPosition))
  );
};
const canMoveLeft = (position: Position, lastPosition: Position) => {
  const [, column] = position;
  const nextPosition = moveLeft(position);
  return (
    column !== 0 &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomLeft,
      PipePieces.TopLeft,
      PipePieces.Animal,
    ].includes(getPipeAt(position)) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomRight,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(nextPosition))
  );
};
const canMoveRight = (position: Position, lastPosition: Position) => {
  const [, column] = position;
  const nextPosition = moveRight(position);
  return (
    column !== FURTHEST_RIGHT &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomRight,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(position)) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomLeft,
      PipePieces.TopLeft,
      PipePieces.Animal,
    ].includes(getPipeAt(nextPosition))
  );
};
const canMoveDown = (position: Position, lastPosition: Position) => {
  const [row] = position;
  const nextPosition = moveDown(position);
  return (
    row !== FURTHEST_DOWN &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Vertical,
      PipePieces.BottomLeft,
      PipePieces.BottomRight,
      PipePieces.Animal,
    ].includes(getPipeAt(position)) &&
    [
      PipePieces.Vertical,
      PipePieces.TopLeft,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(nextPosition))
  );
};

const traverse = (position: Position, lastPosition: Position): Position => {
  if (canMoveUp(position, lastPosition)) {
    return moveUp(position);
  }
  if (canMoveLeft(position, lastPosition)) {
    return moveLeft(position);
  }
  if (canMoveRight(position, lastPosition)) {
    return moveRight(position);
  }
  if (canMoveDown(position, lastPosition)) {
    return moveDown(position);
  }
  throw new Error("Reached Dead End");
};

const findFarthestDistance = () => {
  const startingRow = grid.findIndex((row) => row.includes(PipePieces.Animal));
  const startingColumn = grid[startingRow].indexOf(PipePieces.Animal);
  const startingPosition: Position = [startingRow, startingColumn];

  const visitedPositions = [startingPosition];
  let position = traverse(startingPosition, [-1, -1]);
  visitedPositions.push(startingPosition);
  while (getPipeAt(position) !== PipePieces.Animal) {
    const newPosition = traverse(
      position,
      visitedPositions[visitedPositions.length - 1]
    );
    visitedPositions.push(position);
    position = newPosition;
  }

  console.log(Math.floor(visitedPositions.length / 2));
};

findFarthestDistance();
