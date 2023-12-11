import {
  PipePieces,
  Position,
  getPipeAt,
  isSamePosition,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
} from "./utils.js";

const canMoveUp = (
  grid: PipePieces[][],
  position: Position,
  lastPosition: Position
) => {
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
    ].includes(getPipeAt(grid, position)) &&
    [
      PipePieces.Vertical,
      PipePieces.BottomLeft,
      PipePieces.BottomRight,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, nextPosition))
  );
};
const canMoveLeft = (
  grid: PipePieces[][],
  position: Position,
  lastPosition: Position
) => {
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
    ].includes(getPipeAt(grid, position)) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomRight,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, nextPosition))
  );
};
const canMoveRight = (
  grid: PipePieces[][],
  position: Position,
  lastPosition: Position
) => {
  const [, column] = position;
  const nextPosition = moveRight(position);
  return (
    column !== grid[0].length - 1 &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomRight,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, position)) &&
    [
      PipePieces.Horizontal,
      PipePieces.BottomLeft,
      PipePieces.TopLeft,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, nextPosition))
  );
};
const canMoveDown = (
  grid: PipePieces[][],
  position: Position,
  lastPosition: Position
) => {
  const [row] = position;
  const nextPosition = moveDown(position);
  return (
    row !== grid.length - 1 &&
    !isSamePosition(lastPosition, nextPosition) &&
    [
      PipePieces.Vertical,
      PipePieces.BottomLeft,
      PipePieces.BottomRight,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, position)) &&
    [
      PipePieces.Vertical,
      PipePieces.TopLeft,
      PipePieces.TopRight,
      PipePieces.Animal,
    ].includes(getPipeAt(grid, nextPosition))
  );
};

const traverse = (
  grid: PipePieces[][],
  position: Position,
  lastPosition: Position
): Position => {
  if (canMoveUp(grid, position, lastPosition)) {
    return moveUp(position);
  }
  if (canMoveLeft(grid, position, lastPosition)) {
    return moveLeft(position);
  }
  if (canMoveRight(grid, position, lastPosition)) {
    return moveRight(position);
  }
  if (canMoveDown(grid, position, lastPosition)) {
    return moveDown(position);
  }
  throw new Error("Reached Dead End");
};

export const getPath = (grid: PipePieces[][]) => {
  const startingRow = grid.findIndex((row) => row.includes(PipePieces.Animal));
  const startingColumn = grid[startingRow].indexOf(PipePieces.Animal);
  const startingPosition: Position = [startingRow, startingColumn];

  const path = [startingPosition];
  let position = traverse(grid, startingPosition, [-1, -1]);
  while (getPipeAt(grid, position) !== PipePieces.Animal) {
    const newPosition = traverse(grid, position, path[path.length - 1]);
    path.push(position);
    position = newPosition;
  }
  return path;
};
