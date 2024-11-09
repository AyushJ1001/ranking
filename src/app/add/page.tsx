"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddItem() {
  const [item, setItem] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item }),
      });

      if (response.ok) {
        setItem("");
        router.push("/");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Add New Item</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="border p-2 rounded min-h-[200px]"
          placeholder="Enter items (one per line)"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Items
        </button>
      </form>
    </div>
  );
}
