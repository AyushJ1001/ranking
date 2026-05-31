"use client";

import { type CSSProperties, useEffect, useState } from "react";
import Link from "next/link";
import { exportToCSV, exportToExcel, exportToImage, exportToPDF, RankingData } from "@/utils/exportUtils";
import { Download, FileSpreadsheet, ImageIcon, FileText } from "lucide-react";

type RankChoiceStyle = CSSProperties & {
  "--rank-choice-size": string;
};

function getChoiceStyle(label: string): RankChoiceStyle {
  const words = label.trim().split(/\s+/).filter(Boolean);
  const longestWordLength = Math.max(1, ...words.map((word) => word.length));
  const totalLength = label.length;
  const size = Math.max(
    1.45,
    Math.min(5.8, 6.4 - longestWordLength * 0.26 - Math.max(0, totalLength - 18) * 0.055)
  );

  return {
    "--rank-choice-size": `${size.toFixed(2)}rem`,
  };
}

function formatChoiceLabel(label: string) {
  return label.replaceAll("-", "\u2011");
}

export default function Matchup({
  pairs,
  items,
}: {
  pairs: string[][];
  items: string[];
}) {
  const [startTime, setStartTime] = useState(Date.now());
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(items.map((item) => [item, 0]))
  );
  const [idx, setIdx] = useState(0);
  const [selectedButton, setSelectedButton] = useState<"left" | "right" | null>(
    null
  );

  function handleChoice(button: "left" | "right") {
    if (selectedButton || idx >= pairs.length) {
      return;
    }

    const selectedItem = pairs[idx][button === "left" ? 0 : 1];
    const elapsed = Math.max(Date.now() - startTime, 1);

    setSelectedButton(button);
    setScores((prev) => ({
      ...prev,
      [selectedItem]: (prev[selectedItem] || 0) + 1 / elapsed,
    }));

    setTimeout(() => {
      setSelectedButton(null);
      setIdx((prev) => prev + 1);
      setStartTime(Date.now());
    }, 240);
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        handleChoice("left");
      }
      if (event.key === "ArrowRight") {
        handleChoice("right");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  if (idx >= pairs.length) {
    const sortedScores = Object.entries(scores)
      .sort(([, a], [, b]) => b - a);
    const maxScore = sortedScores.length > 0 ? sortedScores[0][1] : 1;
    
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
      <main className="rank-shell rank-shell--standing" aria-labelledby="standing-title">
        <section className="rank-standing">
          <header className="rank-page-header rank-page-header--compact">
            <p className="rank-kicker">Complete</p>
            <h1 id="standing-title">Final standing</h1>
          </header>

          <div className="rank-export-bar" aria-label="Export standing">
            <button className="rank-export-button" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4" />
                CSV
            </button>
            <button className="rank-export-button" onClick={() => handleExport('excel')}>
                <FileSpreadsheet className="w-4 h-4" />
                Excel
            </button>
            <button className="rank-export-button" onClick={() => handleExport('image')}>
                <ImageIcon className="w-4 h-4" />
                PNG
            </button>
            <button className="rank-export-button" onClick={() => handleExport('pdf')}>
                <FileText className="w-4 h-4" />
                PDF
            </button>
          </div>

          <div className="rank-standing-table" id="ranking-table">
            <div className="rank-standing-table__head" aria-hidden="true">
              <span>Rank</span>
              <span>Item</span>
              <span>Score</span>
            </div>
            {rankingData.map((data) => (
              <div key={data.item} className="rank-standing-row">
                <span>{data.rank}</span>
                <strong>{data.item}</strong>
                <span>{data.score}%</span>
              </div>
            ))}
          </div>

          <Link className="rank-button rank-button--quiet rank-standing__back" href="/">
            Back to list
          </Link>
        </section>
      </main>
    );
  }

  const progressStyle = {
    "--rank-progress": `${Math.round((idx / pairs.length) * 100)}%`,
  } as CSSProperties;

  return (
    <main className="rank-vote" aria-label="Voting" data-decision={selectedButton ?? "idle"}>
      <div
        className="rank-vote__progress"
        style={progressStyle}
        aria-label={`Completed ${idx} of ${pairs.length}`}
      >
        <span>{idx}/{pairs.length}</span>
        <span />
      </div>

      <section
        key={idx}
        className="rank-pair"
        data-decision={selectedButton ?? "idle"}
        aria-label="Choose one item"
      >
        <button
          className="rank-choice rank-choice--left"
          data-selected={selectedButton === "left"}
          disabled={selectedButton !== null}
          style={getChoiceStyle(pairs[idx][0])}
          onClick={() => handleChoice("left")}
        >
          <span className="rank-choice__label">{formatChoiceLabel(pairs[idx][0])}</span>
        </button>
        <div className="rank-versus" aria-hidden="true">VS</div>
        <button
          className="rank-choice rank-choice--right"
          data-selected={selectedButton === "right"}
          disabled={selectedButton !== null}
          style={getChoiceStyle(pairs[idx][1])}
          onClick={() => handleChoice("right")}
        >
          <span className="rank-choice__label">{formatChoiceLabel(pairs[idx][1])}</span>
        </button>
      </section>
    </main>
  );
}
