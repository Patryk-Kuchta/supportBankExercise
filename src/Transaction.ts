import moment, { Moment } from "moment";
import log4js from "log4js";

class Transaction {
  private readonly originName: string;
  private readonly destinationNAme: string;
  private readonly amount: number;
  private readonly date: Moment;
  private readonly narrative: string;

  public constructor(
    origin: string,
    destination: string,
    amount: string,
    dateString: string,
    narrative: string
  ) {
    this.originName = origin;
    this.destinationNAme = destination;

    this.amount = Number(amount);
    if (Number.isNaN(this.amount)) {
      const logger = log4js.getLogger("logs/debug.log");
      const errorMsg = `Provided amount: ${amount} is not a valid number`;
      logger.error(errorMsg);
      throw new TypeError(errorMsg);
    }

    this.date = moment(dateString, "DD/MM/YYYY");
    if (!this.date.isValid()) {
      const logger = log4js.getLogger("logs/debug.log");
      const errorMsg = `Provided date: ${dateString} is not valid`;
      logger.warn(errorMsg);
      console.warn(errorMsg);
    }

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
