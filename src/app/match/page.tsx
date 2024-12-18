import { getItems } from "../items";
import Matchup from "./Matchup";

export default async function Match() {
  const items = await getItems();

  console.log(items);
  const pairs = createPairs(items);
  if (items.length < 2) {
    return <div>Not enough items to match</div>;
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
