import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const map = fileContents.trim().split("\n");
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

const getGuardPosition = (map: string[]): Position => {
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

let { row, col } = getGuardPosition(map);
let guardDirection = 0;

const seen = new Set();

while (true) {
  seen.add(`${row},${col}`);

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

console.log(`Answer for part 1: ${seen.size}`);
assert(seen.size === 5131, "Incorrect answer for part 1");
