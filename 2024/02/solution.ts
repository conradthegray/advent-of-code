import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const reports: number[][] = fileContents
  .trim()
  .split("\n")
  .map((row) => row.split(" ").map((s) => Number(s)));

const isSafe = (report: number[]): boolean => {
  const diffs = report.slice(1).map((num, i) => num - report[i]);
  return diffs.every(
    (diff) =>
      Math.sign(diff) === Math.sign(diffs[0]) &&
      Math.abs(diff) >= 1 &&
      Math.abs(diff) <= 3
  );
};

const result = reports
  .map((report) => isSafe(report))
  .reduce((acc, curr) => acc + Number(curr), 0);

console.log(`Number of safe reports: ${result}`);
assert(result === 379, "Incorrect answer for part 1");

const safeWithDampener = reports
  .map((report) => {
    const subReports = report
      .map((_, i) => [...report.slice(0, i), ...report.slice(i + 1)])
      .map((subReport) => isSafe(subReport));

    return subReports.some((r) => r === true);
  })
  .reduce((acc, curr) => acc + Number(curr), 0);

console.log(`Number of safe reports with dampener: ${safeWithDampener}`);
assert(safeWithDampener === 430, "Incorrect answer for part 2");
