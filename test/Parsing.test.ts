import Account from "../src/models/Account"
import { DetailedInput } from "./helpers/Types"
import { detailedInputIntoCSVLine, feedOneCSVLineToTheSystem } from "./helpers/CSVhelpers"

const mockLogger = {
  warn: jest.fn(),
  error: jest.fn()
};

jest.mock('log4js', () => ({
  getLogger: jest.fn(() => mockLogger),
}));

const parserPreSets = [
  {
    parserName: 'CSV',
    formatMethod: detailedInputIntoCSVLine,
    feedMethod: feedOneCSVLineToTheSystem
  }
]

for (const preset of parserPreSets) {
  describe(`${preset.parserName} Transaction Parsing`, () => {

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

        const inputLine = preset.formatMethod(inputDetailed);
        const output = preset.feedMethod(inputLine);
        const transactionRepresentation = output.toString();

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
          expect(output.getAmountDue()).toBeCloseTo(inputDetailed.amount.input);
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

        const inputLine = preset.formatMethod(inputDetailed);
        const output = preset.feedMethod(inputLine);
        const transactionRepresentation = output.toString();

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
          expect(output['origin']).toBe(sender);
        });

        it('should link to the correct receiver account', () => {
          expect(output['destination']).toBe(receiver);
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

        const inputLine = preset.formatMethod(inputDetailed);

        it('should state that the date is invalid', () => {
          const output = preset.feedMethod(inputLine);
          const transactionRepresentation = output.toString();

          expect(transactionRepresentation).toMatch(
            new RegExp(`^\\[${inputDetailed.date.output}\\] `)
          );
        });

        it('should warn the user sender', () => {

          const loggerWarnSpy = jest.spyOn(mockLogger, 'warn');
          const consoleWarnSpy = jest.spyOn(console, 'warn');

          preset.feedMethod(inputLine);

          expect(loggerWarnSpy).toHaveBeenCalled();
          expect(consoleWarnSpy).toHaveBeenCalled();

          loggerWarnSpy.mockRestore();
          consoleWarnSpy.mockRestore();
        });
      });

      describe('invalid number', () => {
        const inputLine = "01.01.1970,A,B,C,1️⃣"

        it('should throw a TypeError', () => {
          expect(() => preset.feedMethod(inputLine)).toThrow(TypeError);
        });

        it('should output an error to the log file', () => {
          const loggerErrorSpy = jest.spyOn(mockLogger, 'error');

          // Trigger the error to check the logging
          try {
            preset.feedMethod(inputLine);
          } catch (error) {}

          expect(loggerErrorSpy).toHaveBeenCalled();
          loggerErrorSpy.mockRestore();
        });
      });
    });
  });
}

