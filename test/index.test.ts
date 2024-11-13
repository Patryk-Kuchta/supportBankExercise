import Account from "../src/Account"
import Bank from "../src/Bank"

const mockLogger = {
  warn: jest.fn(),
  error: jest.fn()
};

jest.mock('log4js', () => ({
  getLogger: jest.fn(() => mockLogger),
}));

type InputAndOptionallyOutput<T> = {input: T, output?: T}

type DetailedInput = {
  date: {input: string, output: string},
  sender: InputAndOptionallyOutput<string>,
  receiver: InputAndOptionallyOutput<string>,
  narrative: InputAndOptionallyOutput<string>
  amount: InputAndOptionallyOutput<number>
}

function detailedInputIntoCSVLine(detailedInput: DetailedInput) {
  return `${detailedInput.date.input},${detailedInput.sender.input},` +
    `${detailedInput.receiver.input},${detailedInput.narrative.input},` +
    `${detailedInput.amount.input}`;
}

describe('CSV Transaction Parsing', () => {

  describe('valid transactions', () => {

    describe('with new users', () => {
      const inputDetailed: DetailedInput = {
        date: {
          input: "01/02/1998",
          output: "01 Feb 1998"
        },
        sender: {
          input: "Sender A"
        },
        receiver: {
          input: "Receiver B"
        },
        narrative: {
          input: "With the intent of testing the system"
        },
        amount: {
          input: 7.81
        }
      };

      const inputLine = detailedInputIntoCSVLine(inputDetailed);
      const output = Bank.getInstance().parseTransaction(inputLine);
      const transactionRepresentation = output.transaction.toString();

      it('should start with the correct date', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`^\\[${inputDetailed.date.output}\\] `)
        );
      });

      it('should list the correct sender', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`\\] ${inputDetailed.sender.input} sent `)
        );
      });

      it('should list the correct amount', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` sent £${inputDetailed.amount.input.toFixed(2)} to`)
        );
      });

      it('should list the receiver sender correctly', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` to ${inputDetailed.receiver.input} for `)
        );
      });

      it('should list the correct narrative', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` for "${inputDetailed.narrative.input}"\$`)
        );
      });

      it('should store the correct amount', () => {
        expect(output.transaction.getAmountDue()).toBeCloseTo(inputDetailed.amount.input);
      });

      it('should link to the correct sender account', () => {
        expect(output.origin).toBe(Bank.getInstance().getAccountWithName(inputDetailed.sender.input));
      });

      it('should link to the correct receiver account', () => {
        expect(output.destination).toBe(Bank.getInstance().getAccountWithName(inputDetailed.receiver.input));
      });
    });

    describe('with existing users', () => {

      const inputDetailed: DetailedInput = {
        date: {
          input: "01/02/1998",
          output: "01 Feb 1998"
        },
        sender: {
          input: 'Existing Sender'
        },
        receiver: {
          input: 'Existing Receiver'
        },
        narrative: {
          input: "With the intent of testing the system"
        },
        amount: {
          input: 7.81
        }
      };

      Bank.getInstance().getAccountWithName(inputDetailed.sender.input, true);
      Bank.getInstance().getAccountWithName(inputDetailed.receiver.input, true);

      const inputLine = detailedInputIntoCSVLine(inputDetailed);
      const output = Bank.getInstance().parseTransaction(inputLine);
      const transactionRepresentation = output.transaction.toString();

      it('should list the correct sender', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`\\] ${inputDetailed.sender.input} sent `)
        );
      });

      it('should list the receiver sender correctly', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` to ${inputDetailed.receiver.input} for `)
        );
      });
    });
  })

  describe('invalid transactions', () => {

    describe('invalid date', () => {
      const inputDetailed: DetailedInput = {
        date: {
          input: "I want to cause chaos!",
          output: "Invalid date"
        },
        sender: {
          input: "Sender A"
        },
        receiver: {
          input: "Receiver B"
        },
        narrative: {
          input: "With the intent of testing the system"
        },
        amount: {
          input: 7.81
        }
      };

      const inputLine = detailedInputIntoCSVLine(inputDetailed);

      it('should state that the date is invalid', () => {
        const output = Bank.getInstance().parseTransaction(inputLine);
        const transactionRepresentation = output.transaction.toString();

        expect(transactionRepresentation).toMatch(
          new RegExp(`^\\[${inputDetailed.date.output}\\] `)
        );
      });

      it('should warn the user sender', () => {

        const loggerWarnSpy = jest.spyOn(mockLogger, 'warn');
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        Bank.getInstance().parseTransaction(inputLine);

        expect(loggerWarnSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalled();

        loggerWarnSpy.mockRestore();
        consoleWarnSpy.mockRestore();
      });
    });

    describe('invalid number', () => {
      const inputLine = "01.01.1970,A,B,C,1️⃣"

      it('should throw a TypeError', () => {
        expect(() => Bank.getInstance().parseTransaction(inputLine)).toThrow(TypeError);
      });

      it('should output an error to the log file', () => {
        const loggerErrorSpy = jest.spyOn(mockLogger, 'error');

        // Trigger the error to check the logging
        try {
          Bank.getInstance().parseTransaction(inputLine);
        } catch (error) {}

        expect(loggerErrorSpy).toHaveBeenCalled();
        loggerErrorSpy.mockRestore();
      });
    });
  });
});

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
    const input = detailedInputIntoCSVLine(transaction)
    Bank.getInstance().parseTransaction(input)

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