import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const [rulesSection, updatesSection] = fileContents
  .trim()
  .split(/\r?\n\s*\r?\n/);

const rules = rulesSection
  .split("\n")
  .map((row) => row.split("|").map((n) => Number(n)));

const updates = updatesSection
  .split("\n")
  .map((row) => row.split(",").map((n) => Number(n)));

const cache: Record<string, boolean> = {};

for (const [x, y] of rules) {
  cache[`${x}|${y}`] = true;
  cache[`${y}|${x}`] = false;
}

const isOrdered = (update: number[]) => {
  for (let i = 0; i < update.length; i++) {
    for (let j = i + 1; j < update.length; j++) {
      const key = `${update[i]}|${update[j]}`;

      if (key in cache && !cache[key]) {
        return false;
      }
    }
  }

  return true;
};

const answer = updates
  .filter((update) => isOrdered(update))
  .map((update) => {
    const mid = Math.floor(update.length / 2);
    return update[mid];
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${answer}`);
assert(answer === 6505, "Incorrect answer for part 1");

const sortCache: Record<string, number> = {};

for (const [x, y] of rules) {
  sortCache[`${x}|${y}`] = -1;
  sortCache[`${y}|${x}`] = 1;
}

const compare = (x: number, y: number) => sortCache[`${x}|${y}`] ?? 0;

const answer2 = updates
  .filter((update) => !isOrdered(update))
  .map((update) => {
    const sortedUpdate = update.toSorted((x, y) => compare(x, y));
    const mid = Math.floor(sortedUpdate.length / 2);
    return sortedUpdate[mid];
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${answer2}`);
assert(answer2 === 6897, "Incorrect answer for part 1");
