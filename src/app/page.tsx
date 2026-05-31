"use client";

import Link from "next/link";
import AddItems from "@/components/AddItems";
import { clearItems, getItems } from "./items";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setItems(getItems());
    setIsLoaded(true);
  }, []);

  function handleClearItems() {
    clearItems();
    setItems([]);
  }

  return (
    <main className="rank-shell rank-shell--list" role="main" aria-labelledby="page-title">
      <section className="rank-list-page">
        <header className="rank-page-header">
          <p className="rank-kicker">Ranking list</p>
          <h1 id="page-title">What are we comparing?</h1>
        </header>

        <div className="rank-list-layout">
          <section className="rank-list-compose" aria-label="Add items">
            <AddItems onItemsAdded={setItems} />
          </section>

          <section className="rank-list-current" aria-label="Current items">
            <div className="rank-list-current__top">
              <h2>{items.length === 0 ? "No items yet" : `${items.length} items`}</h2>
              {items.length > 0 ? (
                <button className="rank-button rank-button--quiet" onClick={handleClearItems}>
                  Clear
                </button>
              ) : null}
            </div>

            <div className="rank-item-list" key={items.length}>
              {items.length === 0 && isLoaded ? (
                <p className="rank-empty">Add at least two items to start voting.</p>
              ) : null}
              {items.map((item, index) => (
                <div key={`item-${item}-${index}`} className="rank-item-row">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ))}
            </div>

            <Link
              className="rank-button rank-button--primary rank-start"
              href="/match"
              aria-disabled={items.length < 2}
              onClick={(event) => {
                if (items.length < 2) {
                  event.preventDefault();
                }
              }}
            >
              Start voting
            </Link>
          </section>
        </div>
      </section>
    </main>
  );
}
