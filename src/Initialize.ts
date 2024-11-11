import { readFileSync } from "fs";
import Transaction from "./Transaction";
import log4js from "log4js";

function initialize() {
  log4js.configure({
    appenders: {
      file: { type: "fileSync", filename: "logs/debug.log" },
    },
    categories: {
      default: { appenders: ["file"], level: "debug" },
    },
  });

  function loadTheTransactionFile(filename: string) {
    const logger = log4js.getLogger("logs/debug.log");

    const data = readFileSync(filename, "utf8");
    logger.info(`${filename} opened successfully.`);

    for (let line of data.split("\n").slice(1)) {
      if (line.length > 0) {
        Transaction.parseTransaction(line);
      }
    }
  }

  loadTheTransactionFile("./data/Transactions2014.csv");
  loadTheTransactionFile("./data/DodgyTransactions2015.csv");
}

export default initialize;
