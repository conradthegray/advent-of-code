import { assert } from "node:console";
import { readFile } from "node:fs/promises";
import * as path from "node:path";

type Registers = {
  A: number;
  B: number;
  C: number;
};

type Instruction = {
  readonly opcode: number;
  readonly operand: number;
};

type ProgramState = {
  readonly registers: Registers;
  readonly instructionPointer: number;
  readonly output: readonly number[];
};

const parseRegisters = (contents: string): Registers => {
  const registerRegex = /Register [A-C]: (\d+)/g;
  const [A, B, C] = [...contents.matchAll(registerRegex)].map((match) =>
    Number(match[1])
  );
  return { A, B, C };
};

const parseProgram = (contents: string): number[] => {
  const programRegex = /Program: ([\d,]+)/;
  return (
    programRegex
      .exec(contents)?.[1]
      ?.split(",")
      .map((n) => Number(n)) ?? []
  );
};

const getOperandValue = (operand: number, registers: Registers): number => {
  if (0 <= operand && operand <= 3) return operand;
  if (operand === 4) return registers.A;
  if (operand === 5) return registers.B;
  if (operand === 6) return registers.C;

  throw new Error(`Invalid operand: ${operand}`);
};

const executeInstruction = (
  state: ProgramState,
  instruction: Instruction
): ProgramState => {
  const { registers, instructionPointer, output } = state;
  const { opcode, operand } = instruction;
  const value = getOperandValue(operand, registers);

  switch (opcode) {
    case 0: // adv
      return {
        ...state,
        registers: { ...registers, A: registers.A >> value },
        instructionPointer: instructionPointer + 2,
      };

    case 1: // bxl
      return {
        ...state,
        registers: { ...registers, B: registers.B ^ operand },
        instructionPointer: instructionPointer + 2,
      };

    case 2: // bst
      return {
        ...state,
        registers: { ...registers, B: value % 8 },
        instructionPointer: instructionPointer + 2,
      };

    case 3: // jnz
      return {
        ...state,
        instructionPointer:
          registers.A !== 0 ? operand : instructionPointer + 2,
      };

    case 4: // bxc
      return {
        ...state,
        registers: { ...registers, B: registers.B ^ registers.C },
        instructionPointer: instructionPointer + 2,
      };

    case 5: // out
      return {
        ...state,
        output: [...output, value % 8],
        instructionPointer: instructionPointer + 2,
      };

    case 6: // bvd
      return {
        ...state,
        registers: { ...registers, B: registers.A >> value },
        instructionPointer: instructionPointer + 2,
      };

    case 7: // cdv
      return {
        ...state,
        registers: { ...registers, C: registers.A >> value },
        instructionPointer: instructionPointer + 2,
      };

    default:
      throw new Error(`Invalid instruction: ${opcode}`);
  }
};

const executeProgram = (
  program: number[],
  initialRegisters: Registers
): readonly number[] => {
  let state: ProgramState = {
    registers: initialRegisters,
    instructionPointer: 0,
    output: [],
  };

  while (state.instructionPointer < program.length) {
    const instruction: Instruction = {
      opcode: program[state.instructionPointer],
      operand: program[state.instructionPointer + 1],
    };

    state = executeInstruction(state, instruction);
  }

  return state.output;
};

const filePath = path.resolve(import.meta.dirname!, "./input.txt");
const fileContents = await readFile(filePath, { encoding: "utf8" });

const registers = parseRegisters(fileContents);
const program = parseProgram(fileContents);

const result = executeProgram(program, registers);

console.log(`Answer for part 1: ${result.join(",")}`);
assert(result.join(",") === "6,2,7,2,3,1,6,0,5", "Incorrect answer for part 1");
