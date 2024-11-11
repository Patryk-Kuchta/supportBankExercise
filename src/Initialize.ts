import { readFileSync } from "fs";
import Transaction from "./Transaction";

function initialize() {
  function loadTheTransactionFile(filename: string) {
    const data = readFileSync(filename, "utf8");

    for (let line of data.split("\n").slice(1)) {
      if (line.length > 0) {
        Transaction.parseTransaction(line);
      }
    }
  }

  loadTheTransactionFile("./data/Transactions2014.csv");
}

export default initialize;
