import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getItems(): Promise<string[]> {
  try {
    const items = (await redis.get("items")) as string[] || [];
    return items;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }
}
