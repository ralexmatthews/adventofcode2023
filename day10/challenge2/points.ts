import {
  PipePieces,
  Position,
  getPipeAt,
  isSamePosition,
  moveDown,
  moveLeft,
  moveRight,
  moveUp,
  prettyPrintGrid,
} from "./utils.js";

// // cache[row][column] = numberOfBorders
// const cache: Record<string, Record<string, number>> = {};

// const getCache = ([row, column]: Position): number | null =>
//   cache[`r${row}`]?.[`c${column}`] ?? null;
// const setCache = ([row, column]: Position, value: number) => {
//   const rowKey = `r${row}`;
//   const colKey = `c${column}`;
//   if (cache[rowKey]) {
//     cache[rowKey][colKey] = value;
//   } else {
//     cache[rowKey] = { colKey: value };
//   }
// };

const getLineStartDirection = (
  grid: PipePieces[][],
  path: Position[],
  position: Position
): "left" | "right" | null => {
  const pipe = getPipeAt(grid, position);
  switch (pipe) {
    case PipePieces.Horizontal:
      return null;
    case PipePieces.TopLeft:
      return "right";
    case PipePieces.TopRight:
      return "left";
    case PipePieces.Animal: {
      const positionLeft = moveLeft(position);
      const charAtLeft = getPipeAt(grid, positionLeft);
      if (
        [
          PipePieces.BottomRight,
          PipePieces.Horizontal,
          PipePieces.TopRight,
        ].includes(charAtLeft)
      ) {
        return "right";
      }
      const positionRight = moveRight(position);
      const charAtRight = getPipeAt(grid, positionRight);
      if (
        [
          PipePieces.BottomLeft,
          PipePieces.Horizontal,
          PipePieces.TopLeft,
        ].includes(charAtRight)
      ) {
        return "left";
      }
      throw new Error("weird animal found");
    }
  }
  return null;
};

const getLineEndDirection = (
  grid: PipePieces[][],
  path: Position[],
  position: Position
): "left" | "right" => {
  const pipe = getPipeAt(grid, position);
  switch (pipe) {
    case PipePieces.BottomLeft:
      return "left";
    case PipePieces.BottomRight:
      return "right";
    case PipePieces.Animal: {
      const positionLeft = moveLeft(position);
      const charAtLeft = getPipeAt(grid, positionLeft);
      if (
        [
          PipePieces.BottomRight,
          PipePieces.Horizontal,
          PipePieces.TopRight,
        ].includes(charAtLeft)
      ) {
        return "left";
      }
      const positionRight = moveRight(position);
      const charAtRight = getPipeAt(grid, positionRight);
      if (
        [
          PipePieces.BottomLeft,
          PipePieces.Horizontal,
          PipePieces.TopLeft,
        ].includes(charAtRight)
      ) {
        return "right";
      }
      throw new Error("weird animal found");
    }
  }
  throw new Error("encountered line that didn't end right");
};

const countUpBorders = (
  grid: PipePieces[][],
  position: Position,
  shape: Position[],
  direction?: "left" | "right"
): number => {
  const [row] = position;

  if (row === 0) {
    return 0;
  }

  const positionUp = moveUp(position);

  if (shape.some((point) => isSamePosition(positionUp, point))) {
    const positionUpPipe = getPipeAt(grid, positionUp);

    if (positionUpPipe === PipePieces.Horizontal) {
      return 1 + countUpBorders(grid, positionUp, shape);
    }

    if (!direction) {
      return countUpBorders(
        grid,
        positionUp,
        shape,
        getLineStartDirection(grid, shape, positionUp) ?? undefined
      );
    }

    if (positionUpPipe === PipePieces.Vertical) {
      return countUpBorders(grid, positionUp, shape, direction);
    }

    return (
      (getLineEndDirection(grid, shape, positionUp) === direction ? 1 : 0) +
      countUpBorders(grid, positionUp, shape)
    );
  }

  return 0 + countUpBorders(grid, positionUp, shape);
};

export const isPointInShape = (
  grid: PipePieces[][],
  position: Position,
  shape: Position[]
): boolean => {
  if (shape.some((point) => isSamePosition(position, point))) {
    return false;
  }

  const upBorders = countUpBorders(grid, position, shape);

  return upBorders % 2 === 1;
};

export const getNumberOfPointsInPath = (
  grid: PipePieces[][],
  path: Position[]
) => {
  const includedPoints = grid
    .map((rowArray, row) =>
      rowArray.map((_, column) => {
        if (
          row === 0 ||
          row === grid.length - 1 ||
          column === 0 ||
          column === grid[0].length - 1
        ) {
          return false;
        }

        const result = isPointInShape(grid, [row, column], path);
        // result && console.log([row + 1, column + 1]);
        // return result
        return result ? [row, column] : null;
      })
    )
    .flat()
    .filter(Boolean) as Position[];

  prettyPrintGrid(grid, path, includedPoints);
  return includedPoints.length;
};
