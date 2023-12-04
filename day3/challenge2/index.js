import fs from "node:fs";

const file = fs.readFileSync("./day3/challenge2/input.txt", "utf8").trim();

const data = file.split("\n").map((s) => s.trim().split(""));
const lineLength = data[0].length;

const isDigit = (char) => !isNaN(Number(char));

const safeIndex = (arr, index) => {
  const len = arr.length;
  if (index < 0 || index >= len) {
    return null;
  }
  return arr[index];
};

const allStars = data.flatMap((row, lineIndex) =>
  row
    .map((char, charIndex) => (char === "*" ? { lineIndex, charIndex } : null))
    .filter(Boolean)
);

const allNumbers = data
  .map((row, lineIndex) =>
    row
      .map((char, charIndex) =>
        isDigit(char) ? { number: char, lineIndex, charIndex } : null
      )
      .filter(Boolean)
      .reduce(
        ({ numbers, previousIndex }, { number, lineIndex, charIndex }) => {
          const newNumber = {
            numbers: [
              ...numbers,
              { lineIndex, startCharIndex: charIndex, number },
            ],
            previousIndex: { lineIndex, charIndex },
          };

          const isSameLine = lineIndex === previousIndex.lineIndex;
          if (!isSameLine) {
            return newNumber;
          }

          const isPreviousCharacter = charIndex === previousIndex.charIndex + 1;
          if (!isPreviousCharacter) {
            return newNumber;
          }

          const numbersWithoutLast = [...numbers];
          const lastElement = numbersWithoutLast.pop();

          return {
            numbers: [
              ...numbersWithoutLast,
              { ...lastElement, number: lastElement.number + number },
            ],
            previousIndex: { lineIndex, charIndex },
          };
        },
        {
          numbers: [],
          previousIndex: { lineIndex: null, charIndex: null },
        }
      )
      .numbers.map(({ number, lineIndex, startCharIndex }) => ({
        number,
        spacesNumberExists: number.split("").map((_, i) => ({
          lineIndex,
          charIndex: startCharIndex + i,
        })),
      }))
  )
  .flat();

const add = (a, b) => a + b;

const result = allStars
  .map((star) => {
    const numberTopLeft =
      star.charIndex === 0 || star.lineIndex === 0
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex - 1 &&
                charIndex === star.charIndex - 1
            )
          );
    const numberTop =
      star.lineIndex === 0
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex - 1 && charIndex === star.charIndex
            )
          );
    const numberTopRight =
      star.charIndex === lineLength - 1 || star.lineIndex === 0
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex - 1 &&
                charIndex === star.charIndex + 1
            )
          );
    const numberLeft =
      star.charIndex === 0
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex && charIndex === star.charIndex - 1
            )
          );
    const numberRight =
      star.charIndex === lineLength - 1
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex && charIndex === star.charIndex + 1
            )
          );
    const numberBottomLeft =
      star.charIndex === 0 || star.lineIndex === data.length - 1
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex + 1 &&
                charIndex === star.charIndex - 1
            )
          );
    const numberBottom =
      star.lineIndex === data.length - 1
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex + 1 && charIndex === star.charIndex
            )
          );
    const numberBottomRight =
      star.charIndex === lineLength - 1 || star.lineIndex === data.length - 1
        ? null
        : allNumbers.find((number) =>
            number.spacesNumberExists.some(
              ({ lineIndex, charIndex }) =>
                lineIndex === star.lineIndex + 1 &&
                charIndex === star.charIndex + 1
            )
          );

    const uniqueNumbers = [
      ...new Set(
        [
          numberTopLeft,
          numberTop,
          numberTopRight,
          numberLeft,
          numberRight,
          numberBottomLeft,
          numberBottom,
          numberBottomRight,
        ].filter(Boolean)
      ),
    ];

    if (uniqueNumbers.length !== 2) {
      return null;
    }

    const num1 = Number(uniqueNumbers[0].number);
    const num2 = Number(uniqueNumbers[1].number);
    return num1 * num2;
  })
  .reduce(add, 0);

console.log(result);
