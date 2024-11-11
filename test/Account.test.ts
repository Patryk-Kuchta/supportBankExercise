import Account from "../src/models/Account"
import { DetailedInput } from "./helpers/Types"
import { detailedInputIntoCSVLine, feedOneCSVLineToTheSystem } from "./helpers/CSVhelpers"

describe('Account', () => {
  it('should prevent creating an account with an existing name', () => {
    new Account("I am duplicated")
    expect(() => new Account("I am duplicated")).toThrow(Error)
  })

  it('should print all existing account names', () => {
    Account['nameToAccount'] = new Map<string, Account>() // reset

    const names = ['A B', 'B C', 'C D'];

    for (const name of names) {
      new Account(name);
    }

    const accountNameList = Account.getAccountNames()

    expect(accountNameList).toEqual(names);
  })
})

describe('Bank statement', () => {
  const simulatedTransactions : DetailedInput[] = [
    {
      date: {
        input: "01/02/1998",
        output: "01 Feb 1998"
      },
      sender: {
        input: "A"
      },
      receiver: {
        input: "B"
      },
      narrative: {
        input: "First Test Transaction"
      },
      amount: {
        input: 7.81
      }
    },
    {
      date: {
        input: "01/02/1998",
        output: "01 Feb 1998"
      },
      sender: {
        input: "B"
      },
      receiver: {
        input: "A"
      },
      narrative: {
        input: "Second Test Transaction"
      },
      amount: {
        input: 2.31
      }
    }
  ]

  let balance = 0;

  for (const transaction of simulatedTransactions) {
    const input = detailedInputIntoCSVLine(transaction)
    feedOneCSVLineToTheSystem(input)

    if (transaction.sender.input == "A") {
      balance -= transaction.amount.input;
    } else {
      balance += transaction.amount.input;
    }
  }

  const accountStatement = Account.getAccountWithName('A').getAccountStatement()

  it('should state the correct name and balance (on Side A)', () => {
    expect(accountStatement).toMatch(
      new RegExp(`^A \\(£${balance.toFixed(2)}\\)\n`)
    );
  });

  for (const transaction of simulatedTransactions) {
    describe(transaction.narrative.input, () => {

      it('should start with the correct date (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(`\n\\[${transaction.date.output}\\] `)
        );
      });

      it('should list the correct sender (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(`\\] ${transaction.sender.input} \\(`)
        );
      });

      it('should list the correct amount (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(`\\) sent £${transaction.amount.input.toFixed(2)} to`)
        );
      });

      it('should list the receiver sender correctly (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(` to ${transaction.receiver.input} \\(`)
        );
      });

      it('should list the correct narrative (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(` for "${transaction.narrative.input}"`)
        );
      });
    })
  }
})