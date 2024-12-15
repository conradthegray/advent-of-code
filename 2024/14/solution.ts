import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const robots = fileContents
  .trim()
  .split("\n")
  .map((row) => row.match(/-?\d+/g)!.map((n) => Number(n)));

// const GRID_WIDTH = 11;
// const GRID_HEIGHT = 7;
const GRID_WIDTH = 101;
const GRID_HEIGHT = 103;

const STEPS = 100;

const robotPositions = robots.map(([px, py, vx, vy]) => [
  (((px + vx * STEPS) % GRID_WIDTH) + GRID_WIDTH) % GRID_WIDTH,
  (((py + vy * STEPS) % GRID_HEIGHT) + GRID_HEIGHT) % GRID_HEIGHT,
]);

let topLeftQuadrant = 0;
let topRightQuadrant = 0;
let bottomLeftQuadrant = 0;
let bottomRightQuadrant = 0;

const MID_X = Math.floor((GRID_WIDTH - 1) / 2);
const MID_Y = Math.floor((GRID_HEIGHT - 1) / 2);

for (const [robotX, robotY] of robotPositions) {
  if (robotX === MID_X || robotY === MID_Y) {
    continue;
  }

  if (robotX < MID_X) {
    if (robotY < MID_Y) {
      topLeftQuadrant += 1;
    } else {
      bottomLeftQuadrant += 1;
    }
  } else {
    if (robotY < MID_Y) {
      topRightQuadrant += 1;
    } else {
      bottomRightQuadrant += 1;
    }
  }
}

const result =
  topLeftQuadrant * topRightQuadrant * bottomLeftQuadrant * bottomRightQuadrant;

console.log(`Answer for part 1: ${result}`);
assert(result === 224357412, "Incorrect answer for part 1");
