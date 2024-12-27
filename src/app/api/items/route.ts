import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function POST(request: Request) {
  try {
    const { item } = await request.json();
    const items = (await redis.get("items")) || [];
    const newItems = [
      ...items,
      ...item.split("\n").filter((line) => line.trim() !== ""),
    ];
    await redis.set("items", newItems);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to add item: ${error}` },
      { status: 500 }
    );
  }
}
