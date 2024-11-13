import Bank from "../src/models/Bank"
import Account from "../src/models/Account"
import { DetailedInput } from "./helpers/Types"
import { feedCSVEntriesToTheSystem } from "./helpers/CSVhelpers"


describe('Bank', () => {
  it('should print all existing account names', () => {
    Bank.getInstance()['nameToAccount'] = new Map<string, Account>() // reset

    const names = ['A B', 'B C', 'C D'];

    for (const name of names) {
      Bank.getInstance().getAccountWithName(name, true);
    }

    const accountNameList = Bank.getInstance().getAccountNames()

    expect(accountNameList).toEqual(names);
  })

  it('should throw account not found, when that is the case', () => {
    Bank.getInstance()['nameToAccount'] = new Map<string, Account>() // reset

    const nonExistentName = "I don't exist :((((((";

    expect(() => Bank.getInstance().getAccountWithName(nonExistentName)).toThrow(Error)
  });
});

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
    feedCSVEntriesToTheSystem([transaction]);

    if (transaction.sender.input == "A") {
      balance -= transaction.amount.input;
    } else {
      balance += transaction.amount.input;
    }
  }

  const accountStatement = Bank.getInstance().getAccountWithName('A').getAccountStatement()

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
          new RegExp(`\\] ${transaction.sender.input} sent `)
        );
      });

      it('should list the correct amount (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(` sent £${transaction.amount.input.toFixed(2)} to`)
        );
      });

      it('should list the receiver sender correctly (on Side A)', () => {
        expect(accountStatement).toMatch(
          new RegExp(` to ${transaction.receiver.input} for `)
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