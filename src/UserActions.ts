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
  let account = Bank.getInstance().getAccountWithName(accountName);

  if (account) {
    console.log(account.getAccountStatement());
  } else {
    throw new Error("Account with the provided name does not exist.");
  }
}
