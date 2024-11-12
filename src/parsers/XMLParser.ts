import Transaction from "../models/Transaction";
import RecordParser from "./RecordParser";
import { XMLParser } from "fast-xml-parser";
import Account from "../models/Account";
import moment from "moment";

type SupportTransactionXMLRecord = {
  Description: string;
  Value: number;
  Parties: {
    From: string;
    To: string;
  };
  attr_Date: string;
};

type XMLDocumentStructure = {
  TransactionList: {
    SupportTransaction: SupportTransactionXMLRecord[];
  };
};

class XMLRecordParser extends RecordParser {
  public parseFile(text: string): Transaction[] {
    const parsedTransactions: Transaction[] = [];

    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "attr_",
    };

    const parser = new XMLParser(options);
    let dataAsObject = parser.parse(text) as XMLDocumentStructure;

    for (let supportTransaction of dataAsObject.TransactionList
      .SupportTransaction) {
      const origin = Account.getAccountWithName(
        supportTransaction.Parties.From,
        true
      );
      const destination = Account.getAccountWithName(
        supportTransaction.Parties.To,
        true
      );

      const excelEpoch = moment("1900-01-01", "YYYY-MM-DD");
      const date = excelEpoch.add(
        Number(supportTransaction.attr_Date) - 1,
        "days"
      );

      if (!date.isValid()) {
        this.warnUserAboutDateFormat(supportTransaction.attr_Date);
      }

      const newTransaction = new Transaction(
        origin,
        destination,
        supportTransaction.Value,
        date,
        supportTransaction.Description
      );

      parsedTransactions.push(newTransaction);
    }

    return parsedTransactions;
  }
}

export default XMLRecordParser;
