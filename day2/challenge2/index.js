import fs from "node:fs";

const file = fs.readFileSync("./day2/challenge2/input.txt", "utf8").trim();

const getNumberFromStatement = (game, color) =>
  Number(
    game
      .find((game) => game.includes(color))
      ?.replace(` ${color}`, "")
      .trim() ?? "0"
  );

const createCountStructure = (game) => {
  const redNumber = getNumberFromStatement(game, "red");
  const blueNumber = getNumberFromStatement(game, "blue");
  const greenNumber = getNumberFromStatement(game, "green");
  return { red: redNumber, blue: blueNumber, green: greenNumber };
};

/**
 * @typedef {{ title: number, games: {red: number, blue: number, green: number}[]}} Game
 */

/** @returns {Game} */
const readline = (line) => {
  const [title, data] = line.split(":").map((s) => s.trim());
  const gameNumber = Number(title.split(" ")[1]);
  const games = data.split(";").map((s) => s.trim());
  const normalizedGames = games.map((s) => s.split(",").map((s) => s.trim()));
  return {
    title: gameNumber,
    games: normalizedGames.map(createCountStructure),
  };
};

const lines = file.split("\n").map(readline);

const NUMBER_OF_RED = 12;
const NUMBER_OF_BLUE = 14;
const NUMBER_OF_GREEN = 13;

/** @type {(game: Game) => number} */
const getPower = (game) => {
  const mostRedBalls = game.games.reduce(
    (acc, game) => (game.red > acc ? game.red : acc),
    0
  );
  const mostBlueBalls = game.games.reduce(
    (acc, game) => (game.blue > acc ? game.blue : acc),
    0
  );
  const mostGreenBalls = game.games.reduce(
    (acc, game) => (game.green > acc ? game.green : acc),
    0
  );

  return mostRedBalls * mostBlueBalls * mostGreenBalls;
};

const powers = lines.map(getPower);

const add = (a, b) => a + b;
const sumOfPowers = powers.reduce(add, 0);

console.log(sumOfPowers);
