import fs from "node:fs";

const file = fs.readFileSync("./day4/challenge1/input.txt", "utf8").trim();

const data = file.split("\n").map((s) => s.trim());

const scoreCard = (card) => {
  const winningSet = new Set(card.winningNumbers);
  const numberOfWinningNumbers = card.elfNumbers.filter((num) =>
    winningSet.has(num)
  ).length;

  if (numberOfWinningNumbers === 0) {
    return 0;
  }

  return Math.pow(2, numberOfWinningNumbers - 1);
};

const cards = data
  .map((value) => value.replace(/card \d+:\s*/gim, ""))
  .map((value) => value.split(/\s+\|\s+/gim))
  .map(([winningNumbers, elfNumbers]) => ({
    winningNumbers: winningNumbers.split(/\s+/gim).map((v) => v.trim()),
    elfNumbers: elfNumbers.split(/\s+/gim).map((v) => v.trim()),
  }))
  .map(scoreCard);

const add = (a, b) => a + b;

console.log(cards.reduce(add, 0));
