import moment, { Moment } from "moment";
import Account from "./Account";

class Transaction {
  private readonly origin: Account;
  private readonly destination: Account;
  private readonly amount: number;
  private readonly date: Moment;
  private readonly narrative: string;

  private constructor(
    originName: Account,
    destinationName: Account,
    amount: number,
    dateString: string,
    narrative: string
  ) {
    this.origin = originName;
    this.destination = destinationName;
    this.amount = amount;
    this.date = moment(dateString, "DD/MM/YYYY");
    this.narrative = narrative;
  }

  public toString(): string {
    return (
      `[${this.date.format("DD MMM YYYY")}] ${this.origin.toString()} sent £` +
      `${this.amount.toFixed(2)} to ${this.destination.toString()} for ` +
      `"${this.narrative}"`
    );
  }

  public getAmountDue(): number {
    return this.amount;
  }

  public static parseTransaction(csvEntry: string) {
    const parts = csvEntry.split(",");
    const origin = Account.getAccountWithName(parts[1], true);
    const destination = Account.getAccountWithName(parts[2], true);

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
    };
  }
}

export default Transaction;
