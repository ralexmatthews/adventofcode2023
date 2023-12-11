export type Position = [row: number, column: number];

export enum PipePieces {
  Nothing = ".",
  Horizontal = "-",
  Vertical = "|",
  BottomLeft = "7",
  BottomRight = "F",
  TopLeft = "J",
  TopRight = "L",
  Animal = "S",
}

export const moveUp = ([row, column]: Position): Position => [row - 1, column];
export const moveLeft = ([row, column]: Position): Position => [
  row,
  column - 1,
];
export const moveRight = ([row, column]: Position): Position => [
  row,
  column + 1,
];
export const moveDown = ([row, column]: Position): Position => [
  row + 1,
  column,
];

export const getPipeAt = (grid: PipePieces[][], [row, column]: Position) =>
  grid[row][column];

export const isSamePosition = (posA: Position, posB: Position) =>
  posA[0] === posB[0] && posA[1] === posB[1];

export const prettyPrintGrid = (
  grid: PipePieces[][],
  path: Position[],
  includedPoints: Position[]
) => {
  const display = grid.map((row) => row.map(() => " "));
  path.forEach(([row, column]) => {
    const char = getPipeAt(grid, [row, column]);
    display[row][column] =
      char === PipePieces.BottomLeft
        ? "┐"
        : char === PipePieces.BottomRight
        ? "┌"
        : char === PipePieces.TopLeft
        ? "┘"
        : char === PipePieces.TopRight
        ? "└"
        : char === PipePieces.Vertical
        ? "│"
        : char === PipePieces.Horizontal
        ? "─"
        : char;
  });
  includedPoints.forEach(([row, column]) => {
    display[row][column] = ".";
  });
  display.forEach((line) => {
    console.log(line.join(""));
  });
};
