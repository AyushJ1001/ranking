import Link from "next/link";
import { Button } from "@/components/ui/button";
import AddItems from "@/components/AddItems";
import { getItems } from "./items";

// This forces Next.js to re-fetch the data on each request
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  let items: string[] = [];
  try {
    items = await getItems();
  } catch {
    // Simple error display, could be replaced with an error component
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-red-500">Failed to load items. Please try again later.</p>
      </div>
    );
  }

  // Show message when no items exist
  if (items.length === 0) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto mb-12 flex flex-col gap-4">
          <h1 className="text-4xl font-bold mb-4">Item Matcher</h1>
          <p className="text-gray-600">No items added yet. Add some items to get started!</p>
          <AddItems />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8" role="main">
      {/* Header section */}
      <div className="max-w-4xl mx-auto mb-12 flex flex-col gap-4">
        <h1 className="text-4xl font-bold mb-4" id="page-title">Item Matcher</h1>
        <div className="flex gap-4" role="toolbar" aria-label="Item actions">
          <Button asChild className="bg-green-500 hover:bg-green-600">
            <Link href="/match" aria-label="Start matching items">Match Items</Link>
          </Button>
          <Button asChild variant="destructive">
            <Link href="/clear" aria-label="Clear all items">Clear Items</Link>
          </Button>
        </div>
        <AddItems />
      </div>

      {/* Items list section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Current Items</h2>
        <div
          key={items.length}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {items.map((item) => (
            <div
              key={`item-${item}`}
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
