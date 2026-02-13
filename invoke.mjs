import { handler } from "./src/handler.mjs";
import fs from "fs";

process.env.IS_OFFLINE = "true";
process.env.TABLE_NAME = "DrinkTracker";

const event = JSON.parse(fs.readFileSync("./event.json", "utf-8"));

const result = await handler(event);

console.log("Lambda response:");
console.log(result);
