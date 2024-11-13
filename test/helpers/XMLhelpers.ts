import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"
import { XMLBuilder } from "fast-xml-parser"
import { XMLDocumentStructure } from "../../src/parsers/XMLParser"

export function feedXMLEntriesToTheSystem(detailedInputs: DetailedInput[]): Transaction[] {

  const tempDataDir = './data/test/temp.xml';

  const builder = new XMLBuilder({
    ignoreAttributes: false,
    attributeNamePrefix: "attr_",
  });

  const entries = []

  for (const input of detailedInputs) {
    entries.push(
      {
        attr_Date: input.date.input,
        Parties: {
          From: input.sender.input,
          To: input.receiver.input
        },
        Description: input.narrative.input,
        Value: Number(input.amount.input)
      }
    )
  }

  const input : XMLDocumentStructure = {
    TransactionList: {
      SupportTransaction: entries
    }
  }

  const xmlContent = builder.build(input);

  fs.writeFileSync(tempDataDir, xmlContent)

  return loadFile(tempDataDir);
}