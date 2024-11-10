import Link from "next/link";
import fs from "fs";
import path from "path";
import { Button } from "@/components/ui/button";
import AddItems from "@/components/AddItems";

export async function getItems() {
  const items = fs
    .readFileSync(path.join(process.cwd(), "src", "items.txt"), "utf8")
    .split("\n")
    .filter((item) => item.trim() !== "");
  return items;
}

// This forces Next.js to re-fetch the data on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const items = await getItems();

  return (
    <main className="min-h-screen p-8">
      {/* Header section */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4">Item Matcher</h1>
        <div className="flex gap-4">
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href="/match">Match Items</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link href="/clear">Clear Items</Link>
          </Button>
        </div>
        <AddItems />
      </div>

      {/* Items list section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Current Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item}
              className="p-4 rounded-lg shadow hover:shadow-md transition-shadow dark:border dark:border-gray-800 dark:hover:shadow-md"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
