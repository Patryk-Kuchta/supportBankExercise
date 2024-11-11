import RecordParser from "./RecordParser";
import Transaction from "../models/Transaction";
import Account from "../models/Account";
import moment from "moment";

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

      const origin = Account.getAccountWithName(entry.FromAccount, true);
      const destination = Account.getAccountWithName(entry.ToAccount, true);

      const newTransaction = new Transaction(
        origin,
        destination,
        entry.Amount,
        date,
        entry.Narrative
      );

      parsedTransactions.push(newTransaction);
    }

    return parsedTransactions;
  }
}

export default JSONParser;
