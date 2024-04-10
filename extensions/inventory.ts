import { Inventory } from "nolita";
import { readFileSync } from "fs";
import path from "path";

const inventoryObj = JSON.parse(
  readFileSync(path.join(__dirname, ".inventory"), "utf8"),
);

// Inventory holds information specific to the session for your task.
// Usernames, passwords, addresses... anything you need to keep track of.
// The agent will be able to make use of anything you add here.

const inventory = new Inventory(inventoryObj.inventory || []);

export default inventory;
