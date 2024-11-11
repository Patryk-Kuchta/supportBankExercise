import Transaction from "../models/Transaction";
import moment from "moment";
import Account from "../models/Account";
import RecordParser from "./RecordParser";

class CSVParser extends RecordParser {
  public parseFile(text: string): Transaction[] {
    const parsedTransactions: Transaction[] = [];

    for (let line of text.split("\n").slice(1)) {
      if (line.length > 0) {
        const parts = line.split(",");

        const amount = Number(parts[4]);
        if (Number.isNaN(amount)) {
          this.throwErrorAboutNumberFormat(parts[4]);
        }

        const date = moment(parts[0], "DD/MM/YYYY");

        if (!date.isValid()) {
          this.warnUserAboutDateFormat(parts[0]);
        }

        const origin = Account.getAccountWithName(parts[1], true);
        const destination = Account.getAccountWithName(parts[2], true);

        const newTransaction = new Transaction(
          origin,
          destination,
          amount,
          date,
          parts[3]
        );

        parsedTransactions.push(newTransaction);
      }
    }

    return parsedTransactions;
  }
}

export default CSVParser;
