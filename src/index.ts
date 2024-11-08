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
    return `${this.name} (£${this.balance}).`
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
  public date: Date

  private constructor(
    originName: string,
    destinationName: string,
    amount: number,
    dateString: string
  ) {
    this.origin = Account.getOrCreate(originName)
    this.destination = Account.getOrCreate(destinationName)
    this.amount = amount
    this.date = new Date(dateString)
  }

  public toString(): string {
    return `${this.origin.toString()} sent ${this.amount} to 
            ${this.destination.toString()}`
  }

  public parseTransaction(csvEntry: string) {
    let parts = csvEntry.split(',')
    return new Transaction(parts[1], parts[2], Number(parts[3]), parts[0])
  }
}
