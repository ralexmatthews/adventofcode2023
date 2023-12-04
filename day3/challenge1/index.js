import fs from "node:fs";

const file = fs.readFileSync("./day3/challenge1/input.txt", "utf8").trim();

const data = file.split("\n").map((s) => s.trim().split(""));

const isDigit = (char) => !isNaN(Number(char));

const numbersToAdd = [];

const safeIndex = (arr, index) => {
  const len = arr.length;
  if (index < 0 || index >= len) {
    return null;
  }
  return arr[index];
};

const isSymbol = (char) => char && !isDigit(char) && char !== ".";

const hasSymbolInRange = (lineNumber, start, end) => {
  const line = safeIndex(data, lineNumber);
  if (!line) return false;

  for (let i = start; i <= end; i++) {
    if (isSymbol(safeIndex(line, i))) return true;
  }
  return false;
};

for (let line = 0; line < data.length; line++) {
  const currentLine = safeIndex(data, line);
  for (let char = 0; char < currentLine.length; char++) {
    const currentChar = safeIndex(currentLine, char);
    if (!isDigit(currentChar)) {
      continue;
    }

    const indexFound = char;
    let number = currentChar;
    char++;
    while (
      safeIndex(currentLine, char) &&
      isDigit(safeIndex(currentLine, char))
    ) {
      number += safeIndex(currentLine, char);
      char++;
    }

    const left = indexFound - 1;
    const right = left + number.length + 1;

    const hasSymbolOnLineAbove = hasSymbolInRange(line - 1, left, right);
    const hasSymbolOnLineBelow = hasSymbolInRange(line + 1, left, right);
    const hasSymbolBefore = isSymbol(safeIndex(currentLine, left));
    const hasSymbolAfter = isSymbol(safeIndex(currentLine, right));

    const hasSymbolAdjacent =
      hasSymbolOnLineAbove ||
      hasSymbolOnLineBelow ||
      hasSymbolBefore ||
      hasSymbolAfter;

    if (hasSymbolAdjacent) {
      numbersToAdd.push(Number(number));
    }
  }
}

const add = (a, b) => a + b;
console.log(numbersToAdd.reduce(add, 0));
