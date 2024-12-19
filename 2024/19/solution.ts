import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const [patternInputs, designsInput] = fileContents.trim().split("\n\n");

const patterns = patternInputs.split(", ");
const designs = designsInput.split("\n");

const cache = new Map<string, number>();

const calculatePatternPermutations = (
  design: string,
  patterns: string[]
): number => {
  if (!cache.has(design)) {
    if (design.length === 0) {
      return 1;
    }

    let result = 0;

    for (const pattern of patterns) {
      if (design.startsWith(pattern)) {
        result += calculatePatternPermutations(
          design.slice(pattern.length),
          patterns
        );
      }

      cache.set(design, result);
    }
  }

  return cache.get(design)!;
};

const possibleDesigns = designs
  .map((design) => calculatePatternPermutations(design, patterns))
  .filter((n) => n > 0);

console.log(`Answer for part 1: ${possibleDesigns.length}`);

const numberOfPossibleDesigns = designs
  .map((design) => calculatePatternPermutations(design, patterns))
  .reduce((acc, curr) => acc + curr, 0);

console.log(`Answer for part 2: ${numberOfPossibleDesigns}`);
