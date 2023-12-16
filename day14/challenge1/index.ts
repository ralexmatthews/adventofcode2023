import fs from "node:fs";

const file = fs.readFileSync("./day14/challenge1/input.txt", "utf8").trim();

const inputs = file.replace(/\n/gim, "").split(",");

const getScoreOfText = (text: string[], currentScore = 0): number => {
  const currentChar = text[0].charCodeAt(0);
  const added = currentChar + currentScore;
  const times17 = added * 17;
  const modulo256 = times17 % 256;

  if (text.length > 1) {
    return getScoreOfText(text.slice(1), modulo256);
  }

  return modulo256;
};

const add = (a: number, b: number) => a + b;

const scoreTexts = (texts: string[]) =>
  texts
    .map((text) => text.split(""))
    .map((v) => getScoreOfText(v))
    .reduce(add, 0);

console.log(scoreTexts(inputs));
