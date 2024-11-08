import { readFileSync } from 'fs'

class Account {
  private name: string
  private balance: number

  private incomingTransactions: Transaction[]
  private outgoingTransactions: Transaction[]

  public constructor(name, balance = 0) {
    if (Account.nameToAccount.has(name)) {
      throw new Error('Account with this name already exists')
    }

    this.name = name
    this.balance = balance

    this.incomingTransactions = []
    this.outgoingTransactions = []

    Account.nameToAccount.set(name, this)
  }

  public toString(): string {
    return `${this.name} (£${this.balance}).`
  }

  public accountStatement(): string {
    let result = this.toString()
    result += '*'.repeat(5) + ' Incoming Transactions ' + '*'.repeat(5)
    for (let transaction of this.incomingTransactions) {
      result += transaction.toString()
    }
    result += '*'.repeat(5) + ' Outgoing Transactions ' + '*'.repeat(5)
    for (let transaction of this.outgoingTransactions) {
      result += transaction.toString()
    }
    result += '*'.repeat(30)
    return result
  }

  private static nameToAccount: Map<string, Account> = new Map()

  public static getOrCreate(name) {
    if (Account.nameToAccount.has(name)) {
      return Account.nameToAccount.get(name)
    } else {
      return new Account(name)
    }
  }

  public addIncomingTransaction(transaction: Transaction) {
    this.incomingTransactions.push(transaction)
  }

  public addOutgoingTransaction(transaction: Transaction) {
    this.outgoingTransactions.push(transaction)
  }
}

class Transaction {
  public origin: Account
  public destination: Account
  public amount: number
  public date: Date

  private constructor(
    originName: Account,
    destinationName: Account,
    amount: number,
    dateString: string
  ) {
    this.origin = originName
    this.destination = destinationName
    this.amount = amount
    this.date = new Date(dateString)
  }

  public toString(): string {
    return `${this.origin.toString()} sent ${this.amount} to 
            ${this.destination.toString()}`
  }

  public static parseTransaction(csvEntry: string) {
    const parts = csvEntry.split(',')
    const origin = Account.getOrCreate(parts[1])
    const destination = Account.getOrCreate(parts[2])
    return {
      transaction: new Transaction(
        origin,
        destination,
        Number(parts[3]),
        parts[0]
      ),
      origin,
      destination,
    }
  }
}

function loadTheTransactionFile(filename: string) {
  const data = readFileSync(filename, 'utf8')

  for (let line of data.split('\n').slice(1)) {
    let lineParsed = Transaction.parseTransaction(line)

    lineParsed.origin.addIncomingTransaction(lineParsed.transaction)
    lineParsed.destination.addOutgoingTransaction(lineParsed.transaction)
  }
}

loadTheTransactionFile('./data/Transactions2014.csv')
