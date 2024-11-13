import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"

export function feedJSONEntriesToTheSystem(detailedInputs: DetailedInput[]): Transaction[] {

  const tempDataDir = './data/test/temp.json';

  const inputs = [];

  for (const input of detailedInputs) {
    inputs.push(
      {
        "Date": input.date.input,
        "FromAccount": input.sender.input,
        "ToAccount": input.receiver.input,
        "Narrative": input.narrative.input,
        "Amount": Number(input.amount.input)
      }
    )
  }

  fs.writeFileSync(tempDataDir, JSON.stringify(inputs))

  return loadFile(tempDataDir);
}