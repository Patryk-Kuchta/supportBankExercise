import Transaction from "./Transaction";

class Account {
  private readonly name: string;
  private balance: number;

  private readonly incomingTransactions: Transaction[];
  private readonly outgoingTransactions: Transaction[];

  public constructor(name: string, balance = 0) {
    if (Account.nameToAccount.has(name)) {
      throw new Error("Account with this name already exists");
    }

    this.name = name;
    this.balance = balance;

    this.incomingTransactions = [];
    this.outgoingTransactions = [];

    Account.nameToAccount.set(name, this);
  }

  public toString(): string {
    return `${this.name} (£${this.balance.toFixed(2)})`;
  }

  public getAccountStatement(): string {
    let result = this.toString() + "\n";
    result += "*".repeat(5) + " Incoming Transactions " + "*".repeat(5) + "\n";
    for (let transaction of this.incomingTransactions) {
      result += transaction.toString() + "\n";
    }
    result += "*".repeat(5) + " Outgoing Transactions " + "*".repeat(5) + "\n";
    for (let transaction of this.outgoingTransactions) {
      result += transaction.toString() + "\n";
    }
    result += "*".repeat(30);
    return result;
  }

  private static nameToAccount: Map<string, Account> = new Map();

  public static getAccountWithName(name: string, createIfNotExistent = false) {
    if (Account.nameToAccount.has(name)) {
      return Account.nameToAccount.get(name);
    } else if (createIfNotExistent) {
      return new Account(name);
    }
  }

  public addIncomingTransaction(transaction: Transaction) {
    this.balance += transaction.getAmountDue();
    this.incomingTransactions.push(transaction);
  }

  public addOutgoingTransaction(transaction: Transaction) {
    this.balance -= transaction.getAmountDue();
    this.outgoingTransactions.push(transaction);
  }

  public static getAccountNames() {
    return Array.from(this.nameToAccount.keys());
  }
}

export default Account;
