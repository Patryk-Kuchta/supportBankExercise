import Account from "./Account";

export function listAll() {
  console.log(
    Account.getAccountNames()
      .map((account) => {
        return Account.getAccountWithName(account).toString();
      })
      .join("\n")
  );
}

export function listAccount(accountName: string) {
  let accountFound = Account.getAccountWithName(accountName);

  if (accountFound) {
    console.log(accountFound.getAccountStatement());
  } else {
    throw new Error("Account with the provided name does not exist.");
  }
}
