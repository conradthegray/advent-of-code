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

const antennas: Record<string, Coordinate[]> = {};

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const antennaLabel = grid[row][col];

    if (antennaLabel !== ".") {
      if (!(antennaLabel in antennas)) {
        antennas[antennaLabel] = [];
      }

      antennas[antennaLabel].push({ row, col });
    }
  }
}

const isInBounds = ({ row, col }: Coordinate) =>
  row >= 0 && row < rows && col >= 0 && col < cols;

const antinodes = new Set<string>();

for (const coordinates of Object.values(antennas)) {
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = i + 1; j < coordinates.length; j++) {
      const { row: row1, col: col1 } = coordinates[i];
      const { row: row2, col: col2 } = coordinates[j];
      const deltaRow = row2 - row1;
      const deltaCol = col2 - col1;

      const antinode1: Coordinate = {
        row: row1 - deltaRow,
        col: col1 - deltaCol,
      };

      const antinode2: Coordinate = {
        row: row2 + deltaRow,
        col: col2 + deltaCol,
      };

      if (isInBounds(antinode1)) {
        antinodes.add(`${antinode1.row},${antinode1.col}`);
      }

      if (isInBounds(antinode2)) {
        antinodes.add(`${antinode2.row},${antinode2.col}`);
      }
    }
  }
}

console.log(`Answer for part 1: ${[...antinodes].length}`);
assert([...antinodes].length === 359, "Incorrect answer for part 1");

const harmonics = new Set<string>();

for (const coordinates of Object.values(antennas)) {
  for (let i = 0; i < coordinates.length; i++) {
    for (let j = 0; j < coordinates.length; j++) {
      if (i === j) continue;

      const { row: row1, col: col1 } = coordinates[i];
      const { row: row2, col: col2 } = coordinates[j];
      const deltaRow = row2 - row1;
      const deltaCol = col2 - col1;

      const harmonicAntenna: Coordinate = {
        row: row1,
        col: col1,
      };

      while (isInBounds(harmonicAntenna)) {
        harmonics.add(`${harmonicAntenna.row},${harmonicAntenna.col}`);
        harmonicAntenna.row += deltaRow;
        harmonicAntenna.col += deltaCol;
      }
    }
  }
}

console.log(`Answer for part 2: ${[...harmonics].length}`);
assert([...harmonics].length === 1293, "Incorrect answer for part 2");
