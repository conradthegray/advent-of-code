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

const resultPart2 = memory
  .map((row) => {
    const instructions = row
      .matchAll(/mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g)
      .map(([match, a, b]) => (b ? Number(a) * Number(b) : match));

    let active = true;
    let sum = 0;

    for (const instr of instructions) {
      if (active && typeof instr == "number") sum += instr;
      if (active && instr == "don't()") active = false;
      if (!active && instr == "do()") active = true;
    }

    return sum;
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${resultPart2}`);
