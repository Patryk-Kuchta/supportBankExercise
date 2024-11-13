import { promptCLLoop } from "readline-sync";
import { listAccount, listAll } from "./helpers/UserActions";
import userCLIMessages from "../userMessages/cli.json";
import loadFile from "./parsers/loadFile";
import fs from "fs";

loadFile("./data/Transactions2014.csv");

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
  IMPORT: function (filename) {
    if (fs.existsSync(filename)) {
      loadFile(filename);
    } else {
      console.log(userCLIMessages.fileDoesNotExist);
    }
  },
  QUIT: function () {
    console.log(userCLIMessages.farewell);
    return true;
  },
});
