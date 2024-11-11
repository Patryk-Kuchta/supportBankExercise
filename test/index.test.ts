import Transaction from "../src/Transaction"
import Account from "../src/Account"

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

  })

  it('valid transaction, new users', async () => {
    const inputDetailed : DetailedInput = {
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
      narrative : {
        input: "With the intent of testing the system"
      },
      amount: {
        input: 7.81
      }
    }
    const inputLine = detailedInputIntoCSVLine(inputDetailed);

    const output = Transaction.parseTransaction(inputLine);
    const transactionRepresentation = output.transaction.toString()

    // starts with the correct date
    expect(transactionRepresentation).toMatch(
      new RegExp(`^\\[${inputDetailed.date.output}\\] `))

    // lists the correct sender
    expect(transactionRepresentation).toMatch(
      new RegExp(`\\] ${inputDetailed.sender.input} \\(`))

    // lists the correct amount
    expect(transactionRepresentation).toMatch(
      new RegExp(`\\) sent £${inputDetailed.amount.input.toFixed(2)} to`))

    // lists the receiver sender
    expect(output.transaction.toString()).toMatch(
      new RegExp(` to ${inputDetailed.receiver.input} \\(`))

    // lists the correct narrative
    expect(output.transaction.toString()).toMatch(
      new RegExp(` for "${inputDetailed.narrative.input}"\$`))

    // stores the correct amount
    expect(output.transaction.getAmountDue()).toBeCloseTo(inputDetailed.amount.input)

    // links to the correct sender
    expect(output.origin).toBe(Account.getAccountWithName(inputDetailed.sender.input))

    // links to the correct receiver
    expect(output.destination).toBe(Account.getAccountWithName(inputDetailed.receiver.input))
  })
});