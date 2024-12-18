import fs from "fs";
import path from "path";

export async function getItems() {
  const items = fs
    .readFileSync(path.join(process.cwd(), "src", "items.txt"), "utf8")
    .split("\n")
    .filter((item) => item.trim() !== "");
  return items;
}
