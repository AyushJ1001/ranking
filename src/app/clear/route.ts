import { redirect } from "next/navigation";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function GET() {
  await redis.del("items");
  // redirect to home
  redirect("/");
}
