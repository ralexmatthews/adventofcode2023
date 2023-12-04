import fs from "node:fs";

const file = fs.readFileSync("./day4/challenge2/input.txt", "utf8").trim();

const data = file.split("\n").map((s) => s.trim());

const numberOfCards = new Array(data.length).fill(1);

const scoreCard = (card) => {
  const winningSet = new Set(card.winningNumbers);
  const numberOfWinningNumbers = card.elfNumbers.filter((num) =>
    winningSet.has(num)
  ).length;

  return numberOfWinningNumbers;
};

data
  .map((value) => value.replace(/card \d+:\s*/gim, ""))
  .map((value) => value.split(/\s+\|\s+/gim))
  .map(([winningNumbers, elfNumbers]) => ({
    winningNumbers: winningNumbers.split(/\s+/gim).map((v) => v.trim()),
    elfNumbers: elfNumbers.split(/\s+/gim).map((v) => v.trim()),
  }))
  .map((card, index) => {
    const numberOfWinningNumbers = scoreCard(card);
    for (let x = 0; x < numberOfCards[index]; x++) {
      for (let i = index + 1; i < index + 1 + numberOfWinningNumbers; i++) {
        numberOfCards[i]++;
      }
    }
  });

const add = (a, b) => a + b;

console.log(numberOfCards.reduce(add, 0));
