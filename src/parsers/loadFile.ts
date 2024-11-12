import { readFileSync } from "fs";
import RecordParser from "./RecordParser";
import CSVRecordParser from "./CSVParser";
import JSONRecordParser from "./JSONParser";
import XMLRecordParser from "./XMLParser";

const fileExtensionToSubclass = new Map<string, RecordParser>([
  ["csv", new CSVRecordParser()],
  ["json", new JSONRecordParser()],
  ["xml", new XMLRecordParser()],
]);

function loadFile(filename: string) {
  const parts = filename.split(".");
  const fileExtension = parts[parts.length - 1];

  const parser = fileExtensionToSubclass.get(fileExtension);

  const data = readFileSync(filename, "utf8");
  return parser.parseFile(data);
}

export default loadFile;
