import fs from "fs"
import loadFile from "../../src/parsers/loadFile"
import { DetailedInput } from "./Types"
import Transaction from "../../src/models/Transaction"
import { XMLBuilder } from "fast-xml-parser"
import { XMLDocumentStructure } from "../../src/parsers/XMLParser"

export function feedOneXMLEntryToTheSystem(detailedInput: DetailedInput): Transaction {

  const tempDataDir = './data/test/temp.xml';

  const builder = new XMLBuilder({
    ignoreAttributes: false,  // important to handle attributes correctly
    attributeNamePrefix: "attr_", // specifies that "@_" will indicate an attribute
  });

  const input : XMLDocumentStructure = {
    TransactionList: {
      SupportTransaction: [
        {
          attr_Date: detailedInput.date.input,
          Parties: {
            From: detailedInput.sender.input,
            To: detailedInput.receiver.input
          },
          Description: detailedInput.narrative.input,
          Value: Number(detailedInput.amount.input)
        }
      ]
    }
  }

  const xmlContent = builder.build(input);

  fs.writeFileSync(tempDataDir, xmlContent)

  return loadFile(tempDataDir)[0];
}