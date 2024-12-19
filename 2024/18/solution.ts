import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

type Grid = number[][];

type Coordinate = {
  row: number;
  col: number;
};

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const MEMORY_CUTOFF = 1024;
const GRID_SIZE = 70;

const corruptedMemory = fileContents
  .trim()
  .split("\n")
  .map((row) => {
    const [r, c] = row.split(",");

    return {
      row: Number(r),
      col: Number(c),
    };
  });

const generateGrid = (
  gridSize: number,
  corruptedMemory: Coordinate[]
): Grid => {
  const grid: Grid = Array(gridSize + 1)
    .fill([])
    .map(() => Array(gridSize + 1).fill(0));

  corruptedMemory.forEach(({ row, col }) => {
    grid[row][col] = 1;
  });

  return grid;
};

const isInBounds = ({ row, col }: Coordinate) =>
  0 <= row && row <= GRID_SIZE && 0 <= col && col <= GRID_SIZE;

// DFS
// const findShortestPath = (start: Coordinate, end: Coordinate, grid: Grid[]): number => {
//   const stack: Coordinate[] = [start];
//   const visited = new Set<string>();
//   const distances = new Map<string, number>();

//   const toKey = (p: Coordinate) => `${p.row},${p.col}`;

//   visited.add(toKey(start));
//   distances.set(toKey(start), 0);
//   let minDistance = Infinity;

//   while (stack.length > 0) {
//     const current = stack.pop()!;
//     const currentDistance = distances.get(toKey(current))!;

//     if (current.row === end.row && current.col === end.col) {
//       minDistance = Math.min(minDistance, currentDistance);
//       continue; // Continue exploring other paths
//     }

//     const neighbours = [
//       { row: current.row + 1, col: current.col },
//       { row: current.row - 1, col: current.col },
//       { row: current.row, col: current.col + 1 },
//       { row: current.row, col: current.col - 1 },
//     ];

//     for (const next of neighbours) {
//       const key = toKey(next);
//       if (!isInBounds(next)) continue;
//       if (grid[next.row][next.col] === 1) continue;

//       const newDistance = currentDistance + 1;
//       if (visited.has(key) && distances.get(key)! <= newDistance) continue;

//       stack.push(next);
//       visited.add(key);
//       distances.set(key, newDistance);
//     }
//   }

//   return minDistance === Infinity ? -1 : minDistance;
// };

// BFS
const findShortestPath = (
  start: Coordinate,
  end: Coordinate,
  grid: Grid
): number => {
  const queue: Coordinate[] = [start];
  const visited = new Set<string>();
  const distances = new Map<string, number>();

  const toKey = (p: Coordinate) => `${p.row},${p.col}`;

  visited.add(toKey(start));
  distances.set(toKey(start), 0);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentDistance = distances.get(toKey(current))!;

    if (current.row === end.row && current.col === end.col) {
      return currentDistance;
    }

    const neighbours = [
      { row: current.row + 1, col: current.col },
      { row: current.row - 1, col: current.col },
      { row: current.row, col: current.col + 1 },
      { row: current.row, col: current.col - 1 },
    ];

    for (const next of neighbours) {
      const key = toKey(next);

      if (!isInBounds(next)) continue;
      if (grid[next.row][next.col] === 1) continue;
      if (visited.has(key)) continue;

      queue.push(next);
      visited.add(key);
      distances.set(key, currentDistance + 1);
    }
  }

  return -1;
};

const startPoint: Coordinate = { row: 0, col: 0 };
const endPoint: Coordinate = { row: GRID_SIZE, col: GRID_SIZE };
const grid = generateGrid(GRID_SIZE, corruptedMemory.slice(0, MEMORY_CUTOFF));

const shortestPathLength = findShortestPath(startPoint, endPoint, grid);

console.log(`Answer for part 1: ${shortestPathLength}`);
assert(shortestPathLength === 308, "Incorrect answer for part 1");

const isPathBlocked = (
  start: Coordinate,
  end: Coordinate,
  grid: Grid
): boolean => {
  const queue: Coordinate[] = [start];
  const visited = new Set<string>();

  const toKey = (p: Coordinate) => `${p.row},${p.col}`;

  visited.add(toKey(start));

  while (queue.length > 0) {
    const current = queue.shift()!;

    if (current.row === end.row && current.col === end.col) {
      return true;
    }

    const neighbours = [
      { row: current.row + 1, col: current.col },
      { row: current.row - 1, col: current.col },
      { row: current.row, col: current.col + 1 },
      { row: current.row, col: current.col - 1 },
    ];

    for (const next of neighbours) {
      const key = toKey(next);

      if (!isInBounds(next)) continue;
      if (grid[next.row][next.col] === 1) continue;
      if (visited.has(key)) continue;

      queue.push(next);
      visited.add(key);
    }
  }

  return false;
};

let left = 0;
let right = corruptedMemory.length - 1;

while (left < right) {
  const mid = Math.floor((left + right) / 2);

  const pathExists = isPathBlocked(
    startPoint,
    endPoint,
    generateGrid(GRID_SIZE, corruptedMemory.slice(0, mid + 1))
  );

  if (pathExists) {
    left = mid + 1;
  } else {
    right = mid;
  }
}

const resultCoordinate = corruptedMemory[left];

console.log(
  `Answer for part 2: ${resultCoordinate.row},${resultCoordinate.col}`
);
assert(
  resultCoordinate.row === 46 && resultCoordinate.col === 28,
  "Incorrect answer for part 2"
);
