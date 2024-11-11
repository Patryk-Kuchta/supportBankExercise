import Transaction from "../src/Transaction"
import Account from "../src/Account"

// Create a mock logger instance that is shared across the application
const mockLogger = {
  warn: jest.fn(),
};

// Mock `log4js.getLogger` to return the same `mockLogger` instance
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

describe('CSV Transaction Parsing', () => {
  function detailedInputIntoCSVLine(detailedInput: DetailedInput) {
    return `${detailedInput.date.input},${detailedInput.sender.input},` +
           `${detailedInput.receiver.input},${detailedInput.narrative.input},` +
           `${detailedInput.amount.input}`;
  }

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
      const output = Transaction.parseTransaction(inputLine);
      const transactionRepresentation = output.transaction.toString();

      it('should start with the correct date', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`^\\[${inputDetailed.date.output}\\] `)
        );
      });

      it('should list the correct sender', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`\\] ${inputDetailed.sender.input} \\(`)
        );
      });

      it('should list the correct amount', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`\\) sent £${inputDetailed.amount.input.toFixed(2)} to`)
        );
      });

      it('should list the receiver sender correctly', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` to ${inputDetailed.receiver.input} \\(`)
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
        expect(output.origin).toBe(Account.getAccountWithName(inputDetailed.sender.input));
      });

      it('should link to the correct receiver account', () => {
        expect(output.destination).toBe(Account.getAccountWithName(inputDetailed.receiver.input));
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

      const sender = Account.getAccountWithName(inputDetailed.sender.input, true);
      const receiver = Account.getAccountWithName(inputDetailed.receiver.input, true);

      const inputLine = detailedInputIntoCSVLine(inputDetailed);
      const output = Transaction.parseTransaction(inputLine);
      const transactionRepresentation = output.transaction.toString();

      it('should list the correct sender', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(`\\] ${inputDetailed.sender.input} \\(`)
        );
      });

      it('should list the receiver sender correctly', () => {
        expect(transactionRepresentation).toMatch(
          new RegExp(` to ${inputDetailed.receiver.input} \\(`)
        );
      });

      it('should link to the correct sender account', () => {
        expect(output.origin).toBe(sender);
      });

      it('should link to the correct receiver account', () => {
        expect(output.destination).toBe(receiver);
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
        const output = Transaction.parseTransaction(inputLine);
        const transactionRepresentation = output.transaction.toString();

        expect(transactionRepresentation).toMatch(
          new RegExp(`^\\[${inputDetailed.date.output}\\] `)
        );
      });

      it('should warn the user sender', () => {

        const loggerWarnSpy = jest.spyOn(mockLogger, 'warn');
        const consoleWarnSpy = jest.spyOn(console, 'warn');

        Transaction.parseTransaction(inputLine);

        expect(loggerWarnSpy).toHaveBeenCalled();
        expect(consoleWarnSpy).toHaveBeenCalled();

        loggerWarnSpy.mockRestore();
        consoleWarnSpy.mockRestore();
      });
    });
  });

});