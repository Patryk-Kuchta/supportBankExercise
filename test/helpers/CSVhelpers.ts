import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"

export function detailedInputIntoCSVLine(detailedInput: DetailedInput) {
  return `${detailedInput.date.input},${detailedInput.sender.input},` +
    `${detailedInput.receiver.input},${detailedInput.narrative.input},` +
    `${detailedInput.amount.input}`;
}

export function feedOneCSVLineToTheSystem(input: string) {
  input = '\n' + input; // add simulated headers
  const tempDataDir = './data/test/temp.csv';
  fs.writeFileSync(tempDataDir, input);
  return loadFile(tempDataDir)[0];
}