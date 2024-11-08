import { readFileSync } from 'fs'
import Transaction from './Transaction'
import Account from './Account'

function loadTheTransactionFile(filename: string) {
  const data = readFileSync(filename, 'utf8')

  for (let line of data.split('\n').slice(1)) {
    if (line.length > 0) {
      let lineParsed = Transaction.parseTransaction(line)

      lineParsed.origin.addIncomingTransaction(lineParsed.transaction)
      lineParsed.destination.addOutgoingTransaction(lineParsed.transaction)
    }
  }
}

loadTheTransactionFile('./data/Transactions2014.csv')

function listAll() {
  console.log(
    Account.getAccountNames()
      .map((account) => {
        return Account.getAccountWithName(account).toString()
      })
      .join('\n')
  )
}

function listAccount(accountName: string) {
  let accountFound = Account.getAccountWithName(accountName)

  if (accountFound) {
    console.log(accountFound.getAccountStatement())
  } else {
    throw new Error('Account with the provided name does not exist.')
  }
}

listAll()
console.log('-')
listAccount('Chris W')
