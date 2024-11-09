import Link from "next/link";
import fs from "fs";
import path from "path";

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
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4">Item Matcher</h1>
        <div className="flex gap-4">
          <Link
            href="/match"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Match Items
          </Link>
          <Link
            href="/add"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Item
          </Link>
          <Link
            href="/clear"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Clear Items
          </Link>
        </div>
      </div>

      {/* Items list section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Current Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
