import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./example.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const diskMap = fileContents.trim();

let fileId = 0;

const unpackedDiskMap = diskMap
  .split("")
  .map((n, index) => {
    const isFreeSpace = index % 2 !== 0;
    const unpacked = Array(Number(n)).fill(isFreeSpace ? -1 : fileId);

    if (!isFreeSpace) {
      fileId += 1;
    }

    return unpacked;
  })
  .reduce((acc, curr) => [...acc, ...curr], []);

// TODO: part 1 is slow, find a way to optimise it

const formattedDiskMap: number[] = [];
let left = 0;
let right = unpackedDiskMap.length - 1;

while (left <= right) {
  if (unpackedDiskMap[right] === -1) {
    right -= 1;
  } else if (unpackedDiskMap[left] !== -1) {
    formattedDiskMap.push(unpackedDiskMap[left]);
    left += 1;
  } else if (unpackedDiskMap[left] === -1) {
    formattedDiskMap.push(unpackedDiskMap[right]);
    left += 1;
    right -= 1;
  }
}

const checksum = formattedDiskMap
  .map((n, index) => n * index)
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 1: ${checksum}`);
assert(checksum === 6384282079460, "Incorrect answer for part 1");
