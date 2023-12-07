import fs from "node:fs";

const file = fs.readFileSync("./day7/challenge2/input.txt", "utf8").trim();

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
  return groups.some(lenEq(3)) && !groups.some(lenEq(2));
};
const isTwoPair = (hand) => groupCards(hand).filter(lenEq(2)).length === 2;
const isOnePair = (hand) => {
  const groups = groupCards(hand);
  return groups.filter(lenEq(2)).length === 1 && !groups.some(lenEq(3));
};

const getNonJokerRank = (hand) => {
  if (isFiveOfAKind(hand)) return 7;
  if (isFourOfAKind(hand)) return 6;
  if (isFullHouse(hand)) return 5;
  if (isThreeOfAKind(hand)) return 4;
  if (isTwoPair(hand)) return 3;
  if (isOnePair(hand)) return 2;
  return 1;
};
const getSingleJokerRank = (jokerHand) => {
  const hand = {
    ...jokerHand,
    cards: jokerHand.cards.filter((v) => v !== "J"),
  };
  // if four of a kind with jokers, make it 5 of a kind
  if (isFourOfAKind(hand)) return 7;
  // if three of a kind, make four of a kind
  if (isThreeOfAKind(hand)) return 6;
  // if two pair, make full house
  if (isTwoPair(hand)) return 5;
  // if one pair, make 3 of a kind
  if (isOnePair(hand)) return 4;
  // if no pairs, make one pair
  return 2;
};
const getDualJokerRank = (jokerHand) => {
  const hand = {
    ...jokerHand,
    cards: jokerHand.cards.filter((v) => v !== "J"),
  };
  // if three of a kind, make it 5 of a kind
  if (isThreeOfAKind(hand)) return 7;
  // if a single pair, make it 4 of a kind
  if (isOnePair(hand)) return 6;
  // if no pairs, make it 3 of a kind
  return 4;
};
const getTripleJokerRank = (jokerHand) => {
  const hand = {
    ...jokerHand,
    cards: jokerHand.cards.filter((v) => v !== "J"),
  };
  // if one pair, make 5 of a kind
  if (isOnePair(hand)) return 7;
  // if no pairs, make 4 of a kind
  return 6;
};
const getQuadJokerRank = () => 7;
const getFiveJokerRank = () => 7;
const getRankLogic = (hand) => {
  const numberOfJs = hand.cards.filter((card) => card === "J").length;
  switch (numberOfJs) {
    case 1:
      return getSingleJokerRank(hand);
    case 2:
      return getDualJokerRank(hand);
    case 3:
      return getTripleJokerRank(hand);
    case 4:
      return getQuadJokerRank(hand);
    case 5:
      return getFiveJokerRank(hand);
    case 0:
    default:
      return getNonJokerRank(hand);
  }
};
const rankCache = {};
const getRank = (hand) => {
  const key = hand.cards.join("");
  if (rankCache[key]) return rankCache[key];
  const rank = getRankLogic(hand);
  rankCache[key] = rank;
  return rank;
};

const HIGH_CARDS = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
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
