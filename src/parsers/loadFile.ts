import { readFileSync } from "fs";
import RecordParser from "./RecordParser";
import CSVParser from "./CSVParser";
import JSONParser from "./JSONParser";

const fileExtensionToSubclass = new Map<string, RecordParser>([
  ["csv", new CSVParser()],
  ["json", new JSONParser()],
]);

function loadFile(filename: string) {
  const parts = filename.split(".");
  const fileExtension = parts[parts.length - 1];

  const parser = fileExtensionToSubclass.get(fileExtension);

  const data = readFileSync(filename, "utf8");
  return parser.parseFile(data);
}

export default loadFile;
