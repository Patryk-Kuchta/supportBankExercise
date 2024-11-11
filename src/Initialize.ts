import { readFileSync } from "fs";
import Transaction from "./Transaction";

function initialize() {
  function loadTheTransactionFile(filename: string) {
    const data = readFileSync(filename, "utf8");

    for (let line of data.split("\n").slice(1)) {
      if (line.length > 0) {
        let lineParsed = Transaction.parseTransaction(line);

        lineParsed.origin.addIncomingTransaction(lineParsed.transaction);
        lineParsed.destination.addOutgoingTransaction(lineParsed.transaction);
      }
    }
  }

  loadTheTransactionFile("./data/Transactions2014.csv");
}

export default initialize;
