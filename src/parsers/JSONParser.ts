import RecordParser from "./RecordParser";
import Transaction from "../models/Transaction";
import moment from "moment";
import Bank from "../models/Bank";

type expectedJSONEntry = {
  Date: string;
  FromAccount: string;
  ToAccount: string;
  Narrative: string;
  Amount: number;
};

class JSONParser extends RecordParser {
  public parseFile(text: string): Transaction[] {
    const parsedTransactions: Transaction[] = [];
    const list = JSON.parse(text) as expectedJSONEntry[];

    for (let entry of list) {
      const date = moment(entry.Date, "YYYY-MM-DDTHH:mm:ss");

      if (!date.isValid()) {
        this.warnUserAboutDateFormat(entry.Date);
      }

      const origin = Bank.getInstance().getAccountWithName(
        entry.FromAccount,
        true
      );
      const description = Bank.getInstance().getAccountWithName(
        entry.ToAccount,
        true
      );

      const newTransaction = new Transaction(
        entry.FromAccount,
        entry.ToAccount,
        entry.Amount,
        date,
        entry.Narrative
      );

      origin.addOutgoingTransaction(newTransaction);
      description.addIncomingTransaction(newTransaction);

      parsedTransactions.push(newTransaction);
    }

    return parsedTransactions;
  }
}

export default JSONParser;
