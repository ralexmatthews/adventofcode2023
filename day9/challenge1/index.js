// @ts-check
import fs from "node:fs";

const file = fs.readFileSync("./day9/challenge1/input.txt", "utf8").trim();

const sequences = file.split("\n").map((v) => v.split(" ").map(Number));

/** @param {number[]} sequence */
const getSubSequence = (sequence) => {
  const sequenceWithoutFirstNumber = sequence.slice(1);

  const result = sequenceWithoutFirstNumber.reduce(
    /**
     * @type {(
     *   (
     *     acc: { previousNumber: number, subSequence: number[]},
     *     number: number
     *   ) => { previousNumber: number, subSequence: number[] }
     * )} */
    (acc, number) => ({
      previousNumber: number,
      subSequence: [...acc.subSequence, number - acc.previousNumber],
    }),
    {
      previousNumber: sequence[0],
      subSequence: [],
    }
  );

  return result.subSequence;
};

/** @type {(sequence: number[]) => number[][]} */
const getSubSequences = (sequence) => {
  const subSequence = getSubSequence(sequence);

  if (subSequence.every((num) => num === 0)) {
    return [subSequence];
  }

  return [subSequence, ...getSubSequences(subSequence)];
};

/** @param {number[]} sequence */
const getNextNumberInSequence = (sequence) => {
  const subSequences = [sequence, ...getSubSequences(sequence)].reverse();

  return subSequences
    .slice(1)
    .reduce(
      (lastSequence, currentSequence) => {
        const incrementor = lastSequence.at(-1) ?? 0;
        const lastItem = currentSequence.at(-1) ?? 0;
        return [...currentSequence, lastItem + incrementor];
      },
      [...subSequences[0], 0]
    )
    .at(-1);
};

const add = (a, b) => a + b;

console.log(sequences.map(getNextNumberInSequence).reduce(add, 0));
