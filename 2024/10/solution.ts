import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const map = fileContents
  .trim()
  .split("\n")
  .map((row) => row.split("").map((n) => Number(n)));

const rows = map.length;
const cols = map[0].length;

type Position = {
  row: number;
  col: number;
};

const findStartPositions = (map: number[][]): Position[] => {
  const entryPositions: Position[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (map[row][col] === 0) {
        entryPositions.push({ row, col });
      }
    }
  }

  return entryPositions;
};

const isInBounds = ({ row, col }: Position) =>
  row >= 0 && row < rows && col >= 0 && col < cols;

const calculateScore = (map: number[][], startPosition: Position): number => {
  const queue: Position[] = [];
  queue.push(startPosition);

  const visited = new Set<string>();

  let score = 0;

  while (queue.length > 0) {
    const position = queue.shift()!;

    const neighbours: Position[] = [
      { row: position.row - 1, col: position.col },
      { row: position.row, col: position.col + 1 },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
    ];

    for (const neighbour of neighbours) {
      if (!isInBounds(neighbour)) {
        continue;
      }

      if (
        map[neighbour.row][neighbour.col] !==
        map[position.row][position.col] + 1
      ) {
        continue;
      }

      if (visited.has(`${neighbour.row},${neighbour.col}`)) {
        continue;
      }

      visited.add(`${neighbour.row},${neighbour.col}`);

      if (map[neighbour.row][neighbour.col] === 9) {
        score += 1;
      } else {
        queue.push(neighbour);
      }
    }
  }

  return score;
};

const startPositions = findStartPositions(map);

const score = startPositions
  .map((entryPosition) => calculateScore(map, entryPosition))
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${score}`);
assert(score === 744, "Incorrect answer for part 1");

const calculateRating = (map: number[][], startPosition: Position): number => {
  const stack: Position[] = [];
  stack.push(startPosition);

  let rating = 0;

  while (stack.length > 0) {
    const position = stack.pop()!;

    const neighbours: Position[] = [
      { row: position.row - 1, col: position.col },
      { row: position.row, col: position.col + 1 },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
    ];

    for (const neighbour of neighbours) {
      if (!isInBounds(neighbour)) {
        continue;
      }

      if (
        map[neighbour.row][neighbour.col] !==
        map[position.row][position.col] + 1
      ) {
        continue;
      }

      if (map[neighbour.row][neighbour.col] === 9) {
        rating += 1;
      } else {
        stack.push(neighbour);
      }
    }
  }

  return rating;
};

const rating = startPositions
  .map((entryPosition) => calculateRating(map, entryPosition))
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${rating}`);
assert(rating === 1651, "Incorrect answer for part 2");
