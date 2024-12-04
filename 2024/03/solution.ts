import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const memory = fileContents.trim().split("\n");

const sum = memory
  .map((row) =>
    [...row.matchAll(/mul\((\d+),(\d+)\)/g)]
      .map((match) => Number(match[1]) * Number(match[2]))
      .reduce((acc, curr) => acc + curr, 0)
  )
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${sum}`);
assert(sum === 175700056, "Incorrect answer for part 1");

let active = true;

const resultPart2 = memory
  .map((row) =>
    row
      .matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)
      .map(([match, a, b]) =>
        !["do()", "don't()"].includes(match) ? Number(a) * Number(b) : match
      )
      .map((instruction) => {
        if (instruction == "don't()") active = false;
        else if (instruction == "do()") active = true;
        else if (active) return Number(instruction);

        return 0;
      })
      .reduce((acc, curr) => acc + curr, 0)
  )
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${resultPart2}`);
assert(resultPart2 === 71668682, "Incorrect answer for part 2");
