import Bank from "./Bank";

export function listAll() {
  console.log(
    Bank.getInstance()
      .getAccountNames()
      .map((account) => {
        return Bank.getInstance().getAccountWithName(account).toString();
      })
      .join("\n")
  );
}

export function listAccount(accountName: string) {
  let accountFound = Bank.getInstance().getAccountWithName(accountName);

  if (accountFound) {
    console.log(accountFound.getAccountStatement());
  } else {
    throw new Error("Account with the provided name does not exist.");
  }
}
