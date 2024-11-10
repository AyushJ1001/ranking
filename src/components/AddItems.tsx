"use client";

import { useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";

export default function AddItems() {
  const itemRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  async function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: itemRef.current?.value }),
      });

      if (response.ok) {
        itemRef.current!.value = "";
        router.push("/");
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  return (
    <div className="grid w-full gap-2">
      <Textarea placeholder="Add items here, one per line." ref={itemRef} />
      <Button onClick={handleClick}>Add Items</Button>
    </div>
  );
}
