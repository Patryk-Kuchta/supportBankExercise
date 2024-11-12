import { question } from "readline-sync";
import { listAccount, listAll } from "./UserActions";
import userCLIMessages from "../userMessages/cli.json";
import LoadTransactionFile from "./LoadTransactionFile";

LoadTransactionFile("./data/Transactions2014.csv");

let userAnswer = "HELP";

while (userAnswer !== "QUIT") {
  switch (userAnswer) {
    case "HELP": {
      console.log(userCLIMessages.help);
      break;
    }
    case "LIST ALL": {
      listAll();
      break;
    }
    case userAnswer.match(/^LIST\s+(.+)/)?.input: {
      const accountName = userAnswer.replace(/^LIST\s+/i, "").trim();
      console.log(accountName);

      listAccount(accountName);
      break;
    }
    default: {
      console.log(userCLIMessages.unknown);
      break;
    }
  }

  userAnswer = question(userCLIMessages.prompt);
}

console.log(userCLIMessages.farewell);
