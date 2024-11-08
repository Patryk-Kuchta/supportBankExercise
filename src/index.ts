class Account {
  private name: string
  private balance: number

  public constructor(name, balance = 0) {
    if (Account.nameToAccount.has(name)) {
      throw new Error('Account with this name already exists')
    }

    this.name = name
    this.balance = balance

    Account.nameToAccount.set(name, this)
  }

  public toString(): string {
    return `${this.name} has a balance of £${this.balance}.`
  }

  private static nameToAccount: Map<string, Account> = new Map()

  public static getOrCreate(name) {
    if (Account.nameToAccount.has(name)) {
      return Account.nameToAccount.get(name)
    } else {
      return new Account(name)
    }
  }
}

class Transaction {
  public origin: Account
  public destination: Account
  public amount: number

  private constructor(
    originName: string,
    destinationName: string,
    amount: number
  ) {
    this.amount = amount
  }
}
