import Transaction from "../models/Transaction";
import RecordParser from "./RecordParser";
import { XMLParser } from "fast-xml-parser";
import Account from "../models/Account";
import moment from "moment";
import Bank from "../models/Bank";

type SupportTransactionXMLRecord = {
  Description: string;
  Value: number;
  Parties: {
    From: string;
    To: string;
  };
  attr_Date: string;
};

export type XMLDocumentStructure = {
  TransactionList: {
    SupportTransaction:
      | SupportTransactionXMLRecord[]
      | SupportTransactionXMLRecord;
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

    let transactionList = Array.isArray(
      dataAsObject.TransactionList.SupportTransaction
    )
      ? dataAsObject.TransactionList.SupportTransaction
      : [dataAsObject.TransactionList.SupportTransaction];

    for (let supportTransaction of transactionList) {
      const origin = Bank.getInstance().getAccountWithName(
        supportTransaction.Parties.From,
        true
      );
      const destination = Bank.getInstance().getAccountWithName(
        supportTransaction.Parties.To,
        true
      );

      const dateNumber = Number(supportTransaction.attr_Date);

      const excelEpoch = moment("1900-01-01", "YYYY-MM-DD");
      let date = excelEpoch.add(dateNumber - 1, "days");

      if (!date.isValid() || Number.isNaN(dateNumber)) {
        this.warnUserAboutDateFormat(supportTransaction.attr_Date);
        date = moment("not-a-date");
      }

      const newTransaction = new Transaction(
        supportTransaction.Parties.From,
        supportTransaction.Parties.To,
        supportTransaction.Value,
        date,
        supportTransaction.Description
      );

      origin.addOutgoingTransaction(newTransaction);
      destination.addIncomingTransaction(newTransaction);

      parsedTransactions.push(newTransaction);
    }

    return parsedTransactions;
  }
}

export default XMLRecordParser;
