import Account from "./Account";

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
}

export default Bank;
