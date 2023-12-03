import fs from "node:fs";

const file = fs.readFileSync("./day1/challenge2/input.txt", "utf8");

const lines = file.split("\n");

const isDigit = (char) => !isNaN(Number(char));

const sortByIndex = (listOfMatches) => {
  return [...listOfMatches].sort((a, b) => a.index - b.index);
};

/** @param {str} line */
const getNumbers = (line) => {
  const digit = [...line.matchAll(/\d/gim)];
  const one = [...line.matchAll(/one/gim)];
  const two = [...line.matchAll(/two/gim)];
  const three = [...line.matchAll(/three/gim)];
  const four = [...line.matchAll(/four/gim)];
  const five = [...line.matchAll(/five/gim)];
  const six = [...line.matchAll(/six/gim)];
  const seven = [...line.matchAll(/seven/gim)];
  const eight = [...line.matchAll(/eight/gim)];
  const nine = [...line.matchAll(/nine/gim)];

  return sortByIndex(
    [digit, one, two, three, four, five, six, seven, eight, nine]
      .flat()
      .filter(Boolean)
  ).map((match) => match[0]);
};

const convertToDigit = (num) => {
  if (isDigit(num)) {
    return num;
  }

  switch (num) {
    case "one":
      return "1";
    case "two":
      return "2";
    case "three":
      return "3";
    case "four":
      return "4";
    case "five":
      return "5";
    case "six":
      return "6";
    case "seven":
      return "7";
    case "eight":
      return "8";
    case "nine":
      return "9";
    default:
      return "0";
  }
};

const result = lines
  .map((line) => {
    const numbers = getNumbers(line);
    const firstDigit = numbers[0];
    const lastDigit = numbers[numbers.length - 1];

    const combinedNumber =
      convertToDigit(firstDigit) + convertToDigit(lastDigit);
    return Number(combinedNumber);
  })
  .reduce((a, b) => a + b, 0);

console.log(result);
