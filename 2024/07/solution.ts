import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./example.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

type Equation = {
  result: number;
  values: number[];
};

const equations: Equation[] = fileContents
  .trim()
  .split("\n")
  .map((row) => {
    const parts = row.split(":");

    return {
      result: Number(parts[0]),
      values: parts[1]
        .trim()
        .split(" ")
        .map((n) => Number(n)),
    };
  });

// TODO: rewrite the solution to be more efficient

const generatePermutations = (items: string[], n: number): string[][] => {
  let permutations: string[][] = [[]];

  for (let i = 0; i < n; i++) {
    const newPermutations: string[][] = [];

    for (const perm of permutations) {
      for (const item of items) {
        newPermutations.push([...perm, item]);
      }
    }

    permutations = newPermutations;
  }

  return permutations;
};

const evaluateEquation = (eq: string[], expectedResult: number) => {
  let op: string = "";
  let i = 1;
  let result = Number(eq[0]);

  while (i < eq.length) {
    if (OPERATIONS.includes(eq[i])) {
      op = eq[i];
    } else if (op === "+") {
      result += Number(eq[i]);
    } else if (op === "*") {
      result *= Number(eq[i]);
    }

    i += 1;
  }

  return result === expectedResult;
};

const generateAllPossibleEquations = (
  values: number[],
  operations: string[]
): string[] => {
  const result: string[] = [];

  for (let i = 0; i < operations.length; i++) {
    result.push(String(values[i]));
    result.push(operations[i]);
  }

  result.push(String(values[values.length - 1]));
  return result;
};

const OPERATIONS = ["+", "*"];

const calibrationResult = equations
  .filter((equation) => {
    const possibleOperations = generatePermutations(
      OPERATIONS,
      equation.values.length - 1
    );

    const possibleEquations = possibleOperations.map((ops) =>
      generateAllPossibleEquations(equation.values, ops)
    );

    return possibleEquations.some((eq) =>
      evaluateEquation(eq, equation.result)
    );
  })
  .reduce((acc, curr) => acc + curr.result, 0);

console.log(`Answer for part 1: ${calibrationResult}`);
assert(calibrationResult === 5540634308362, "Incorrect answer for part 1");
