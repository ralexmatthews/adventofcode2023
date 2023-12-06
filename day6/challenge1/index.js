import fs from "node:fs";

const file = fs.readFileSync("./day6/challenge1/input.txt", "utf8").trim();

const [rawTimes, rawDistances] = file
  .split("\n")
  .map((v) => v.replace(/\w+:/gim, "").trim().split(/\s+/gim).map(Number));

const timesAndDistances = rawTimes.map((time, index) => ({
  time,
  distance: rawDistances[index],
}));

const getDistance = (buttonTime, timeOfRace) => {
  const timeToTravel = timeOfRace - buttonTime;
  return timeToTravel * buttonTime;
};

const raceTimes = timesAndDistances
  .map(
    (race) =>
      new Array(race.time - 1)
        .fill(0)
        .map((_, i) => i + 1)
        .map((buttonTime) => ({
          buttonTime,
          distance: getDistance(buttonTime, race.time),
        }))
        .filter(({ distance }) => distance > race.distance).length
  )
  .reduce((acc, v) => acc * v, 1);

console.log(raceTimes);
