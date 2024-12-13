import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const grid = fileContents.trim().split("\n");
const rows = grid.length;
const cols = grid[0].length;

type Coordinate = {
  row: number;
  col: number;
};

const isInBounds = ({ row, col }: Coordinate) =>
  row >= 0 && row < rows && col >= 0 && col < cols;

const floodFill = (startingPosition: Coordinate, currentCrop: string) => {
  const stack: Coordinate[] = [];
  stack.push(startingPosition);

  const plot = new Map<string, Coordinate>();
  plot.set(`${startingPosition.row},${startingPosition.col}`, startingPosition);

  while (stack.length > 0) {
    const position = stack.pop()!;

    const neighbours: Coordinate[] = [
      { row: position.row - 1, col: position.col },
      { row: position.row, col: position.col + 1 },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
    ];

    for (const neighbour of neighbours) {
      if (!isInBounds(neighbour)) {
        continue;
      }

      if (grid[neighbour.row][neighbour.col] !== currentCrop) {
        continue;
      }

      if (plot.has(`${neighbour.row},${neighbour.col}`)) {
        continue;
      }

      plot.set(`${neighbour.row},${neighbour.col}`, neighbour);
      stack.push(neighbour);
    }
  }

  return plot.values().toArray();
};

const plots: Coordinate[][] = [];
const visited = new Set<string>();

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    if (visited.has(`${row},${col}`)) {
      continue;
    }

    visited.add(`${row},${col}`);

    const plot = floodFill({ row, col }, grid[row][col]);
    plots.push(plot);

    for (const p of plot) {
      visited.add(`${p.row},${p.col}`);
    }
  }
}

const calculatePerimeter = (plot: Coordinate[]) => {
  let perimeter = 0;

  for (const position of plot) {
    perimeter += 4;

    const neighbours: Coordinate[] = [
      { row: position.row - 1, col: position.col },
      { row: position.row, col: position.col + 1 },
      { row: position.row + 1, col: position.col },
      { row: position.row, col: position.col - 1 },
    ];

    for (const neighbour of neighbours) {
      const isNeighbour = plot.find(
        (pos) => pos.row === neighbour.row && pos.col === neighbour.col
      );

      if (isNeighbour) {
        perimeter -= 1;
      }
    }
  }

  return perimeter;
};

const cost = plots
  .map((plot) => calculatePerimeter(plot) * plot.length)
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${cost}`);
assert(cost === 1473276, "Incorrect answer for part 1");
