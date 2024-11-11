import log4js from "log4js";
import Transaction from "./Transaction";
import Account from "./Account";
import moment from "moment";
import { readFileSync } from "fs";

abstract class RecordParser {
  public abstract parseFile(text: string): Transaction[];

  protected warnUserAboutDateFormat(originalDateString: string) {
    const errorMsg = `Provided date: ${originalDateString} is not valid`;
    log4js.getLogger("logs/debug.log").warn(errorMsg);
    console.warn(errorMsg);
  }

  protected throwErrorAboutNumberFormat(originalNumberString: string) {
    const errorMsg = `Provided amount: ${originalNumberString} is not a valid number`;
    log4js.getLogger("logs/debug.log").error(errorMsg);
    throw new TypeError(errorMsg);
  }
}

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

const fileExtensionToSubclass = new Map<string, RecordParser>([
  ["csv", new CSVParser()],
]);

function loadFile(filename: string) {
  const parts = filename.split(".");
  const fileExtension = parts[parts.length - 1];

  const parser = fileExtensionToSubclass.get(fileExtension);

  const data = readFileSync(filename, "utf8");
  return parser.parseFile(data);
}

export default loadFile;
