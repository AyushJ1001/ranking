"use client";

import { getItems } from "../items";
import Matchup from "./Matchup";
import { useEffect, useState } from "react";

export default function Match() {
  const [items, setItems] = useState<string[]>([]);
  const [pairs, setPairs] = useState<string[][]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedItems = getItems();
    setItems(storedItems);
    setPairs(createPairs(storedItems));
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (items.length < 2) {
    return (
      <main className="rank-shell rank-shell--list" aria-labelledby="not-enough-title">
        <section className="rank-list-page rank-list-page--empty">
          <header className="rank-page-header">
            <p className="rank-kicker">Voting</p>
            <h1 id="not-enough-title">Add two items first</h1>
          </header>
          <a className="rank-button rank-button--primary" href="/">
            Back to list
          </a>
        </section>
      </main>
    );
  }

  return (
    <>
      <Matchup pairs={pairs} items={items} />
    </>
  );
}

function createPairs(items: string[]) {
  // generate all permutations of 2 items
  const pairs = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      pairs.push([items[i], items[j]]);
    }
  }

  // shuffle the pairs
  pairs.sort(() => Math.random() - 0.5);
  return pairs;
}
