import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const map = fileContents
  .trim()
  .split("\n")
  .map((row) => row.split(""));

const rows = map.length;
const cols = map[0].length;

const GUARD_POSITIONS = ["^", ">", "v", "<"];
const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

type Position = {
  row: number;
  col: number;
};

const getGuardPosition = (map: string[][]): Position => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (GUARD_POSITIONS.includes(map[row][col])) {
        return {
          row,
          col,
        };
      }
    }
  }

  throw new Error("No guard position found");
};

const { row: guardStartRow, col: guardStartCol } = getGuardPosition(map);
let row = guardStartRow;
let col = guardStartCol;
let guardDirection = 0;

const visited = new Set();

while (true) {
  visited.add(`${row},${col}`);

  const [deltaRow, deltaCol] = DIRECTIONS[guardDirection];

  const isInBounds =
    row + deltaRow >= 0 &&
    row + deltaRow < rows &&
    col + deltaCol >= 0 &&
    col + deltaCol < cols;

  if (!isInBounds) {
    break;
  }

  if (map[row + deltaRow][col + deltaCol] === "#") {
    guardDirection = (guardDirection + 1) % GUARD_POSITIONS.length;
  } else {
    row += deltaRow;
    col += deltaCol;
  }
}

console.log(`Answer for part 1: ${visited.size}`);
assert(visited.size === 5131, "Incorrect answer for part 1");

// TODO: This is a brute force approach. Find a clever solution

const detectLoop = (map: string[][], row: number, col: number): boolean => {
  let guardDirection = 0;

  const visited = new Set();

  while (true) {
    visited.add(`${row},${col},${guardDirection}`);

    const [deltaRow, deltaCol] = DIRECTIONS[guardDirection];

    const isInBounds =
      row + deltaRow >= 0 &&
      row + deltaRow < rows &&
      col + deltaCol >= 0 &&
      col + deltaCol < cols;

    if (!isInBounds) {
      return false;
    }

    if (map[row + deltaRow][col + deltaCol] === "#") {
      guardDirection = (guardDirection + 1) % GUARD_POSITIONS.length;
    } else {
      row += deltaRow;
      col += deltaCol;
    }

    if (visited.has(`${row},${col},${guardDirection}`)) {
      return true;
    }
  }
};

let count = 0;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    if (map[row][col] !== ".") {
      continue;
    }

    map[row][col] = "#";

    if (detectLoop(map, guardStartRow, guardStartCol)) {
      count += 1;
    }

    map[row][col] = ".";
  }
}

console.log(`Answer for part 2: ${count}`);
assert(count === 1784, "Incorrect answer for part 2");
