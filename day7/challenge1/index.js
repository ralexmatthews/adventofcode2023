import fs from "node:fs";

const file = fs.readFileSync("./day7/challenge1/input.txt", "utf8").trim();

const hands = file
  .split("\n")
  .map((v) => v.split(" "))
  .map(([cards, bid]) => ({ cards: cards.split(""), bid: Number(bid) }));

const groupCards = (hand) =>
  Object.entries(
    hand.cards.reduce(
      (acc, card) => ({ ...acc, [card]: (acc[card] ?? 0) + 1 }),
      {}
    )
  ).map(([card, number]) => new Array(number).fill(card));

const lenEq = (eq) => (v) => v.length === eq;

const isFiveOfAKind = (hand) => groupCards(hand).some(lenEq(5));
const isFourOfAKind = (hand) => groupCards(hand).some(lenEq(4));
const isFullHouse = (hand) => {
  const groups = groupCards(hand);
  return groups.some(lenEq(3)) && groups.some(lenEq(2));
};
const isThreeOfAKind = (hand) => {
  const groups = groupCards(hand);
  return groups.some(lenEq(3)) && groups.some(lenEq(1));
};
const isTwoPair = (hand) => groupCards(hand).filter(lenEq(2)).length === 2;
const isOnePair = (hand) => groupCards(hand).filter(lenEq(1)).length === 3;

const getRank = (hand) => {
  if (isFiveOfAKind(hand)) return 7;
  if (isFourOfAKind(hand)) return 6;
  if (isFullHouse(hand)) return 5;
  if (isThreeOfAKind(hand)) return 4;
  if (isTwoPair(hand)) return 3;
  if (isOnePair(hand)) return 2;
  return 1;
};

const HIGH_CARDS = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const breakTie = ({ cards: cards1 }, { cards: cards2 }) => {
  for (let i = 0; i < 5; i++) {
    const card1 = cards1[i];
    const card2 = cards2[i];

    const indexOfCard1 = HIGH_CARDS.indexOf(card1);
    const indexOfCard2 = HIGH_CARDS.indexOf(card2);

    if (indexOfCard1 < indexOfCard2) return -1;
    if (indexOfCard1 > indexOfCard2) return 1;
  }
  return 0;
};

const rankHands = (hands) =>
  hands
    .sort((hand1, hand2) => {
      const a = getRank(hand1);
      const b = getRank(hand2);
      if (a > b) return -1;
      if (a < b) return 1;
      return breakTie(hand1, hand2);
    })
    .reverse();

const getTotalWinnings = (hands) =>
  hands
    .map((hand, index) => hand.bid * (index + 1))
    .reduce((acc, winnings) => acc + winnings, 0);

console.log(getTotalWinnings(rankHands(hands)));
