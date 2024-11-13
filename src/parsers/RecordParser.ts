import log4js from "log4js";
import Transaction from "../models/Transaction";

abstract class RecordParser {
  public abstract parseFile(text: string): Transaction[];

  protected warnUserAboutDateFormat(originalDateString: string) {
    const errorMsg = `Provided date: ${originalDateString} is not valid`;
    log4js.getLogger("logs/debug.log").warn(errorMsg);
    console.warn(errorMsg);
  }

  protected throwErrorAboutNumberFormat(originalNumberString: string) {
    const errorMsg = `Provided amount: ${originalNumberString} is not a valid number`;
    log4js.getLogger("logs/debug.log").error(errorMsg);
    throw new TypeError(errorMsg);
  }
}

export default RecordParser;
