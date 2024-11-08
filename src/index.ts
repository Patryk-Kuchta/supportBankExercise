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
    return `${this.name} (£${this.balance.toFixed(2)})`
  }

  public getAccountStatement(): string {
    let result = this.toString()
    result += '*'.repeat(5) + ' Incoming Transactions ' + '*'.repeat(5) + '\n'
    for (let transaction of this.incomingTransactions) {
      result += transaction.toString() + '\n'
    }
    result += '*'.repeat(5) + ' Outgoing Transactions ' + '*'.repeat(5) + '\n'
    for (let transaction of this.outgoingTransactions) {
      result += transaction.toString() + '\n'
    }
    result += '*'.repeat(30)
    return result
  }

  private static nameToAccount: Map<string, Account> = new Map()

  public static getAccountWithName(name, createIfNotExistent = false) {
    if (Account.nameToAccount.has(name)) {
      return Account.nameToAccount.get(name)
    } else if (createIfNotExistent) {
      return new Account(name)
    }
  }

  public addIncomingTransaction(transaction: Transaction) {
    this.balance += transaction.getAmountDue()
    this.incomingTransactions.push(transaction)
  }

  public addOutgoingTransaction(transaction: Transaction) {
    this.balance -= transaction.getAmountDue()
    this.outgoingTransactions.push(transaction)
  }

  public static getAccountNames() {
    return Array.from(this.nameToAccount.keys())
  }
}

class Transaction {
  private origin: Account
  private destination: Account
  private amount: number
  private date: Date
  private narrative: string

  private constructor(
    originName: Account,
    destinationName: Account,
    amount: number,
    dateString: string,
    narrative: string
  ) {
    this.origin = originName
    this.destination = destinationName
    this.amount = amount
    this.date = new Date(dateString)
    this.narrative = narrative
  }

  public toString(): string {
    return (
      `[${this.date}] ${this.origin.toString()} sent ${this.amount} to ` +
      `${this.destination.toString()} for "${this.narrative}"`
    )
  }

  public getAmountDue(): number {
    return this.amount
  }

  public static parseTransaction(csvEntry: string) {
    const parts = csvEntry.split(',')
    const origin = Account.getAccountWithName(parts[1], true)
    const destination = Account.getAccountWithName(parts[2], true)

    return {
      transaction: new Transaction(
        origin,
        destination,
        Number(parts[4]),
        parts[0],
        parts[3]
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

console.log(
  Account.getAccountNames()
    .map((account) => {
      return Account.getAccountWithName(account).getAccountStatement()
    })
    .join('\n\n')
)
