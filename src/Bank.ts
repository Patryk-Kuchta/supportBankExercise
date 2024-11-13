import Account from "./Account";
import Transaction from "./Transaction";
import log4js from "log4js";
import moment from "moment";

class Bank {
  private static instance: Bank = null;
  private nameToAccount: Map<string, Account>;

  private constructor() {
    this.nameToAccount = new Map();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Bank();
    }
    return this.instance;
  }

  public getAccountWithName(name: string, createIfNotExistent = false) {
    if (this.nameToAccount.has(name)) {
      return this.nameToAccount.get(name);
    } else if (createIfNotExistent) {
      const newAccount = new Account(name);
      this.nameToAccount.set(name, newAccount);
      return newAccount;
    } else {
      throw new Error(`Account: '${name}' not found`);
    }
  }

  public getAccountNames() {
    return Array.from(this.nameToAccount.keys());
  }

  public parseTransaction(csvEntry: string) {
    const parts = csvEntry.split(",");
    const origin = this.getAccountWithName(parts[1], true);
    const destination = this.getAccountWithName(parts[2], true);

    const parsedAmount = Number(parts[4]);
    if (Number.isNaN(parsedAmount)) {
      const logger = log4js.getLogger("logs/debug.log");
      const errorMsg = `Provided amount: ${parts[4]} is not a valid number`;
      logger.error(errorMsg);
      throw new TypeError(errorMsg);
    }

    const parsedDate = moment(parts[0], "DD/MM/YYYY");
    if (!parsedDate.isValid()) {
      const logger = log4js.getLogger("logs/debug.log");
      const errorMsg = `Provided date: ${parts[0]} is not valid`;
      logger.warn(errorMsg);
      console.warn(errorMsg);
    }

    const newTransaction = new Transaction(
      parts[1],
      parts[2],
      parsedAmount,
      parsedDate,
      parts[3]
    );

    origin.addOutgoingTransaction(newTransaction);
    destination.addIncomingTransaction(newTransaction);

    return {
      transaction: newTransaction,
      origin,
      destination,
    };
  }
}

export default Bank;
