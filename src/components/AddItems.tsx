"use client";

import { useRef } from "react";
import { addItems } from "@/app/items";

export default function AddItems({
  onItemsAdded,
}: {
  onItemsAdded?: (items: string[]) => void;
}) {
  const itemRef = useRef<HTMLTextAreaElement>(null);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    try {
      const items = addItems(itemRef.current?.value);
      itemRef.current!.value = "";
      onItemsAdded?.(items);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  return (
    <div className="rank-add">
      <textarea
        className="rank-textarea"
        placeholder="Add items, one per line"
        ref={itemRef}
        rows={7}
      />
      <button className="rank-button rank-button--primary" onClick={handleClick}>
        Add items
      </button>
    </div>
  );
}
