import { readFileSync } from "fs";
import Bank from "./Bank";

function loadTransactionFile(filename: string) {
  const data = readFileSync(filename, "utf8");

  for (let line of data.split("\n").slice(1)) {
    if (line.length > 0) {
      Bank.getInstance().parseTransaction(line);
    }
  }
}

loadTransactionFile("./data/Transactions2014.csv");

export default loadTransactionFile;
