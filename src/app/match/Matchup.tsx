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
import { exportToCSV, exportToExcel, exportToImage, exportToPDF, RankingData } from "@/utils/exportUtils";
import { Download, FileSpreadsheet, Image, FileText } from "lucide-react";

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
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);
    const maxScore = sortedScores[0][1];
    
    const rankingData: RankingData[] = sortedScores.map(([item, score], i) => ({
      rank: i + 1,
      item,
      score: Math.round((score / maxScore) * 100)
    }));

    const handleExport = (format: 'csv' | 'excel' | 'image' | 'pdf') => {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const filename = `ranking-${timestamp}`;
      
      switch (format) {
        case 'csv':
          exportToCSV(rankingData, filename);
          break;
        case 'excel':
          exportToExcel(rankingData, filename);
          break;
        case 'image':
          exportToImage('ranking-table', filename);
          break;
        case 'pdf':
          exportToPDF('ranking-table', filename);
          break;
      }
    };

    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Final Rankings</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => handleExport('csv')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Excel
              </Button>
              <Button
                onClick={() => handleExport('image')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                PNG
              </Button>
              <Button
                onClick={() => handleExport('pdf')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                PDF
              </Button>
            </div>
          </div>
          
          <Table id="ranking-table" className="border rounded-lg text-center">
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
              {rankingData.map((data, i) => (
                <TableRow
                  key={i}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="text-center font-medium text-lg py-4">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : data.rank}
                  </TableCell>
                  <TableCell className="font-medium text-lg py-4 px-6">
                    {data.item}
                  </TableCell>
                  <TableCell className="text-right font-medium text-lg py-4 pr-8">
                    {data.score}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
