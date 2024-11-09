import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const { item } = await request.json();
    const filePath = path.join(process.cwd(), "src", "items.txt");

    // Split the input into lines and filter out empty lines
    const items = item.split("\n").filter((line: string) => line.trim() !== "");

    // Append each item to the file with a newline
    await fs.appendFile(filePath, items.join("\n") + "\n");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error writing to file:", error);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
