
"use client";

import { cn } from "@/lib/utils";

interface BingoCardProps {
  card: string[];
  markedSquares: boolean[];
  onSquareClick: (index: number) => void;
  winningPattern?: number[]; // Winning pattern is now optional
}

const FREE_SPACE_INDEX = 12;

export function BingoCard({ card, markedSquares, onSquareClick, winningPattern = [] }: BingoCardProps) {
  const isGameOver = winningPattern.length > 0;

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2 aspect-square p-2 bg-card/50 rounded-lg border">
      {card.map((entry, index) => {
        const isMarked = markedSquares[index];
        const isWinning = winningPattern.includes(index);
        const isFreeSpace = index === FREE_SPACE_INDEX;

        return (
          <div
            key={index}
            className={cn(
              "h-full w-full p-1 text-center flex items-center justify-center rounded-md shadow-sm transition-all duration-300 ease-in-out border",
              "text-xs sm:text-sm md:text-base break-words whitespace-normal leading-tight font-body",
              isFreeSpace ? "bg-secondary text-secondary-foreground font-bold border-primary" : "bg-card border-border",
              isMarked && "bg-primary text-primary-foreground transform scale-105 border-primary-foreground/50",
              isWinning && "bg-accent text-accent-foreground animate-pulse scale-110",
              isGameOver && !isWinning && "opacity-60"
            )}
            aria-live="polite"
            aria-label={`${entry} - ${isMarked ? 'Marked' : 'Unmarked'}`}
          >
            {isFreeSpace ? "FREE" : entry}
          </div>
        );
      })}
    </div>
  );
}
