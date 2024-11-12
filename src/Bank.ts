import Account from "./Account";
import Transaction from "./Transaction";

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

    const newTransaction = new Transaction(
      parts[1],
      parts[2],
      Number(parts[4]),
      parts[0],
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
