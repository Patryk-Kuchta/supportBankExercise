import { promptCLLoop } from "readline-sync";
import { listAccount, listAll } from "./UserActions";
import userCLIMessages from "../userMessages/cli.json";
import LoadTransactionFile from "./LoadTransactionFile";
import log4js from "log4js";

log4js.configure({
  appenders: {
    file: { type: "fileSync", filename: "logs/debug.log" },
  },
  categories: {
    default: { appenders: ["file"], level: "debug" },
  },
});

LoadTransactionFile("./data/Transactions2014.csv");

promptCLLoop({
  HELP: function () {
    console.log(userCLIMessages.help);
  },
  LIST: function (userName, surnameLetter = "") {
    if (userName === "ALL") {
      listAll();
    } else {
      const fullUserName = surnameLetter
        ? userName + " " + surnameLetter
        : userName;
      console.log(fullUserName);

      listAccount(fullUserName);
    }
  },
  QUIT: function () {
    console.log(userCLIMessages.farewell);
    return true;
  },
});
