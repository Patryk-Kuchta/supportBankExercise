import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"

export function feedOneCSVEntryToTheSystem(detailedInput: DetailedInput) {
  const entry = `${detailedInput.date.input},${detailedInput.sender.input},` +
    `${detailedInput.receiver.input},${detailedInput.narrative.input},` +
    `${detailedInput.amount.input}`;

  return feedOneCSVLineToTheSystem(entry);
}

export function feedOneCSVLineToTheSystem(input: string) : Transaction {
  input = '\n' + input; // add simulated headers
  const tempDataDir = './data/test/temp.csv';
  fs.writeFileSync(tempDataDir, input);
  return loadFile(tempDataDir)[0];
}