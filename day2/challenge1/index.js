import fs from "node:fs";

const file = fs.readFileSync("./day2/challenge1/input.txt", "utf8").trim();

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

/** @type {(game: Game) => boolean} */
const isValidGame = (game) => {
  const isRedsValid = game.games.every((game) => game.red <= NUMBER_OF_RED);
  const isGreensValid = game.games.every(
    (game) => game.green <= NUMBER_OF_GREEN
  );
  const isBluesValid = game.games.every((game) => game.blue <= NUMBER_OF_BLUE);

  return isRedsValid && isGreensValid && isBluesValid;
};

const validGames = lines.filter((line) => isValidGame(line));

const add = (a, b) => a + b;
const sumOfGameTitles = validGames.map((game) => game.title).reduce(add, 0);

console.log(sumOfGameTitles);
