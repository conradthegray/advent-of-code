import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const leftList: number[] = [];
const rightList: number[] = [];

fileContents
  .trim()
  .split("\n")
  .forEach((row: string) => {
    const values = row.split(" ").filter((c) => c !== "");

    leftList.push(Number(values[0]));
    rightList.push(Number(values[1]));
  });

const compareAsc = (a: number, b: number) => a - b;
const leftListSorted = leftList.toSorted(compareAsc);
const rightListSorted = rightList.toSorted(compareAsc);

const result = leftListSorted
  .map((value, index) => Math.abs(value - rightListSorted[index]))
  .reduce((acc, prev) => acc + prev, 0);

console.log(`Total distance between lists: ${result}`);
assert(result === 2264607, "Incorrect answer for part 1");

const rightListOccurences: Record<number, number> = {};

rightList.forEach((number) => {
  if (rightListOccurences[number] === undefined) {
    rightListOccurences[number] = 0;
  }

  rightListOccurences[number] += 1;
});

const similarityScore = leftList
  .map((number) => {
    if (rightListOccurences[number] !== undefined) {
      return number * rightListOccurences[number];
    }

    return 0;
  })
  .reduce((acc, prev) => acc + prev, 0);

console.log(`Similarity score: ${similarityScore}`);
assert(similarityScore === 19457120, "Incorrect answer for part 1");
