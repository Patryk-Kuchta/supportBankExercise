import moment, { Moment } from "moment";
import Account from "./Account";

class Transaction {
  private readonly origin: Account;
  private readonly destination: Account;
  private readonly amount: number;
  private readonly date: Moment;
  private readonly narrative: string;

  public constructor(
    origin: Account,
    destination: Account,
    amount: number,
    dateString: string,
    narrative: string
  ) {
    this.origin = origin;
    this.destination = destination;
    this.amount = amount;
    this.date = moment(dateString, "DD/MM/YYYY");
    this.narrative = narrative;

    origin.addOutgoingTransaction(this);
    destination.addIncomingTransaction(this);
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
}

export default Transaction;
