import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getItems(): Promise<string[]> {
  try {
    const rawItems = await redis.get("items");
    if (Array.isArray(rawItems) && rawItems.every(item => typeof item === "string")) {
      return rawItems as string[];
    } else {
      console.warn("Invalid data format for 'items' in Redis. Returning an empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
  }
}
