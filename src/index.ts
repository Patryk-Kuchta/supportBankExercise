import { promptCLLoop } from "readline-sync";
import { listAccount, listAll } from "./UserActions";
import userCLIMessages from "../userMessages/cli.json";
import LoadTransactionFile from "./LoadTransactionFile";

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
