import fs from "fs";
import { redirect } from "next/navigation";
import path from "path";

export async function GET() {
  fs.writeFileSync(path.join(process.cwd(), "src", "items.txt"), "");
  // redirect to home
  redirect("/");
}
