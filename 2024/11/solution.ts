import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const stones = fileContents
  .trim()
  .split(" ")
  .map((n) => Number(n));

const numberToDigits = (n: number): number[] =>
  String(n)
    .split("")
    .map((n) => Number(n));

const blink = (stones: number[]): number[] => {
  const newStones: number[] = [];

  for (const stone of stones) {
    if (stone === 0) {
      newStones.push(1);
    } else if (String(stone).length % 2 === 0) {
      const digits = numberToDigits(stone);
      const mid = digits.length / 2;
      const firstHalf = Number(digits.slice(0, mid).join(""));
      const secondHalf = Number(digits.slice(mid).join(""));

      newStones.push(firstHalf);
      newStones.push(secondHalf);
    } else {
      newStones.push(stone * 2024);
    }
  }

  return newStones;
};

const ITERATIONS_PART_1 = 25;
let result = stones;

for (let i = 0; i < ITERATIONS_PART_1; i++) {
  result = blink(result);
}

console.log(`Answer for part 1: ${result.length}`);
assert(result.length === 194557, "Incorrect answer for part 1");

const cache = new Map<string, number>();

const countStones = (stone: number, stepsRemaining: number): number => {
  if (stepsRemaining === 0) {
    return 1;
  }

  const cacheKey = `${stone},${stepsRemaining}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  let result: number;

  if (stone === 0) {
    result = countStones(1, stepsRemaining - 1);
  } else if (String(stone).length % 2 === 0) {
    const digits = numberToDigits(stone);
    const mid = digits.length / 2;
    const firstHalf = Number(digits.slice(0, mid).join(""));
    const secondHalf = Number(digits.slice(mid).join(""));

    const leftSide = countStones(firstHalf, stepsRemaining - 1);
    const rightSide = countStones(secondHalf, stepsRemaining - 1);

    result = leftSide + rightSide;
  } else {
    result = countStones(stone * 2024, stepsRemaining - 1);
  }

  cache.set(cacheKey, result);

  return result;
};

const ITERATIONS_PART_2 = 75;

const result2 = stones
  .map((stone) => countStones(stone, ITERATIONS_PART_2))
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${result2}`);
assert(result2 === 231532558973909, "Incorrect answer for part 2");
