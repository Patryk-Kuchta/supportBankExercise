import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"

export function feedCSVEntriesToTheSystem(detailedInputs: DetailedInput[]) {
  let entries = "";

  for (const input of detailedInputs) {
    entries += `${input.date.input},${input.sender.input},` +
      `${input.receiver.input},${input.narrative.input},` +
      `${input.amount.input}\n`
  }

  return feedCSVToTheSystem(entries);
}

export function feedCSVToTheSystem(input: string) : Transaction[] {
  input = '\n' + input; // add simulated headers
  const tempDataDir = './data/test/temp.csv';
  fs.writeFileSync(tempDataDir, input);
  return loadFile(tempDataDir);
}