import moment, { Moment } from "moment";
import Account from "./Account";

class Transaction {
  private readonly originName: string;
  private readonly destinationNAme: string;
  private readonly amount: number;
  private readonly date: Moment;
  private readonly narrative: string;

  public constructor(
    origin: string,
    destination: string,
    amount: number,
    date: Moment,
    narrative: string
  ) {
    this.originName = origin;
    this.destinationNAme = destination;

    this.amount = amount;
    this.date = date;
    this.narrative = narrative;
  }

  public toString(): string {
    return (
      `[${this.date.format("DD MMM YYYY")}] ${this.originName} sent £` +
      `${this.amount.toFixed(2)} to ${this.destinationNAme} for ` +
      `"${this.narrative}"`
    );
  }

  public getAmountDue(): number {
    return this.amount;
  }
}

export default Transaction;
