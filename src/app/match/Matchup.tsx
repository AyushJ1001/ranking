"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Table className="border rounded-lg max-w-4xl mx-auto text-center">
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px] text-center font-bold text-lg py-4">
                Rank
              </TableHead>
              <TableHead className="text-center font-bold text-lg py-4 px-6">
                Item
              </TableHead>
              <TableHead className="font-bold text-lg text-right py-4 pr-8">
                Score
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(scores)
              .sort(([, a], [, b]) => b - a)
              .map(([item, score], i, arr) => {
                const maxScore = arr[0][1];
                const scaledScore = Math.round((score / maxScore) * 100);
                return (
                  <TableRow
                    key={i}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-center font-medium text-lg py-4">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </TableCell>
                    <TableCell className="font-medium text-lg py-4 px-6">
                      {item}
                    </TableCell>
                    <TableCell className="text-right font-medium text-lg py-4 pr-8">
                      {scaledScore}%
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-center text-2xl font-bold">
        Completed: {idx}/{pairs.length}
      </h1>
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
    </>
  );
}
