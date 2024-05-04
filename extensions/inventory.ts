import { Inventory } from "nolita";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const inventoryObj = JSON.parse(
  readFileSync(path.join(__dirname, ".inventory"), "utf8"),
);

// Inventory holds information specific to the session for your task.
// Usernames, passwords, addresses... anything you need to keep track of.
// The agent will be able to make use of anything you add here.

const inventory = new Inventory(inventoryObj.inventory || []);

export default inventory;
