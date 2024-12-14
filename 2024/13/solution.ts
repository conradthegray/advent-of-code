import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const regex = /\b\d+\b/g;

const machines = fileContents
  .split("\n\n")
  .map((text) => text.match(regex)!.map((n) => Number(n)));

const findSolution = (machine: number[]) => {
  const [ax, ay, bx, by, prizeX, prizeY] = machine;

  const pressesA = (prizeX * by - prizeY * bx) / (ax * by - ay * bx);
  const pressesB = (prizeX - ax * pressesA) / bx;

  if (Number.isInteger(pressesA) && Number.isInteger(pressesB)) {
    return [pressesA, pressesB];
  }

  return null;
};

const answer = machines
  .map((machine) => findSolution(machine))
  .filter((result) => result !== null)
  .map(([a, b]) => 3 * a + b)
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${answer}`);
assert(answer === 31065, "Incorrect answer for part 1");

const BIG_NUMBER = 10000000000000;

const answer2 = machines
  .map(([ax, ay, bx, by, prizeX, prizeY]) => [
    ax,
    ay,
    bx,
    by,
    prizeX + BIG_NUMBER,
    prizeY + BIG_NUMBER,
  ])
  .map((machine) => findSolution(machine))
  .filter((result) => result !== null)
  .map(([a, b]) => 3 * a + b)
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${answer2}`);
assert(answer2 === 93866170395343, "Incorrect answer for part 2");
