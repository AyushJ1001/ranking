"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function Matchup({
  pairs,
  items,
}: {
  pairs: string[][];
  items: string[];
}) {
  const [startTime, setStartTime] = useState(Date.now());
  const [choice, setChoice] = useState("");
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(items.map((item) => [item, 0]))
  );
  const [idx, setIdx] = useState(0);
  const [selectedButton, setSelectedButton] = useState<"left" | "right" | null>(
    null
  );

  function handleClick(button: "left" | "right") {
    setSelectedButton(button);
    setChoice(pairs[idx][button === "left" ? 0 : 1]);

    setTimeout(() => {
      setSelectedButton(null);
    }, 200);
  }

  useEffect(() => {
    const elapsed = Date.now() - startTime;
    if (choice) {
      setIdx((prev) => prev + 1);
      setScores((prev) => ({
        ...prev,
        [choice]: (prev[choice] || 0) + 1 / elapsed,
      }));
      setStartTime(Date.now());
      setChoice("");
    }
  }, [choice, startTime, idx, pairs]);

  if (idx >= pairs.length) {
    return (
      <div className="p-8">
        <div className="rounded-md border">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Item
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium">
                  Score (ms)
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(scores)
                .sort(([, a], [, b]) => b - a)
                .map(([item, score], i, arr) => {
                  const maxScore = arr[0][1];
                  const scaledScore = Math.round((score / maxScore) * 100);
                  return (
                    <tr key={item} className="border-t">
                      <td className="p-4">{item}</td>
                      <td className="p-4">{scaledScore}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full h-screen gap-4 p-4">
      <Button
        className={`flex-1 h-full text-3xl transition-colors duration-200 ${
          selectedButton === "left" ? "bg-green-500" : ""
        }`}
        onClick={() => handleClick("left")}
      >
        {pairs[idx][0]}
      </Button>
      <span className="text-4xl font-bold">VS</span>
      <Button
        className={`flex-1 h-full text-3xl transition-colors duration-200 ${
          selectedButton === "right" ? "bg-green-500" : ""
        }`}
        onClick={() => handleClick("right")}
      >
        {pairs[idx][1]}
      </Button>
    </div>
  );
}
