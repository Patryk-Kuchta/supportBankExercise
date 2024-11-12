import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"

export function feedOneJSONEntryToTheSystem(detailedInput: DetailedInput): Transaction {

  const tempDataDir = './data/test/temp.json';

  const input = [{
    "Date": detailedInput.date.input,
    "FromAccount": detailedInput.sender.input,
    "ToAccount": detailedInput.receiver.input,
    "Narrative": detailedInput.narrative.input,
    "Amount": Number(detailedInput.amount.input)
  }]

  fs.writeFileSync(tempDataDir, JSON.stringify(input))

  return loadFile(tempDataDir)[0];
}