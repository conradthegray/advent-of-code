import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const grid = fileContents.trim().split("\n");

let count = 0;

for (let row = 0; row < grid.length; row++) {
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[row][col] !== "X") continue;

    for (const directionRow of [-1, 0, 1]) {
      for (const directionCol of [-1, 0, 1]) {
        if (directionRow === 0 && directionCol === 0) continue;

        const isInBounds =
          row + 3 * directionRow >= 0 &&
          row + 3 * directionRow < grid.length &&
          col + 3 * directionCol >= 0 &&
          col + 3 * directionCol < grid[0].length;

        if (!isInBounds) continue;

        const isMNext = grid[row + directionRow][col + directionCol] === "M";
        const isANext =
          grid[row + 2 * directionRow][col + 2 * directionCol] === "A";
        const isSNext =
          grid[row + 3 * directionRow][col + 3 * directionCol] === "S";

        if (isMNext && isANext && isSNext) count += 1;
      }
    }
  }
}

console.log(`Answer for part 1: ${count}`);
assert(count === 2557, "Incorrect answer for part 1");

count = 0;

for (let row = 1; row < grid.length - 1; row++) {
  for (let col = 1; col < grid[0].length - 1; col++) {
    if (grid[row][col] !== "A") continue;

    const corners = [
      [grid[row - 1][col - 1]],
      [grid[row - 1][col + 1]],
      [grid[row + 1][col + 1]],
      [grid[row + 1][col - 1]],
    ];

    const validCorners = ["MMSS", "MSSM", "SSMM", "SMMS"];

    if (validCorners.includes(corners.join(""))) count += 1;
  }
}

console.log(`Answer for part 2: ${count}`);
assert(count === 1854, "Incorrect answer for part 2");
