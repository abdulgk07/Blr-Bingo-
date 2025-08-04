"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BingoCardProps {
  card: string[];
  markedSquares: boolean[];
  onSquareClick: (index: number) => void;
  winningPattern: number[];
}

const FREE_SPACE_INDEX = 12;

export function BingoCard({ card, markedSquares, onSquareClick, winningPattern }: BingoCardProps) {
  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1.5 sm:gap-2 aspect-square">
      {card.map((entry, index) => {
        const isMarked = markedSquares[index];
        const isWinning = winningPattern.includes(index);
        const isFreeSpace = index === FREE_SPACE_INDEX;

        return (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "h-full w-full p-1 text-center flex items-center justify-center rounded-md shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105",
              "text-xs sm:text-sm md:text-base break-words whitespace-normal leading-tight font-body",
              isFreeSpace ? "bg-secondary text-secondary-foreground font-bold" : "bg-card",
              isMarked && !isFreeSpace && "bg-primary text-primary-foreground",
              isWinning && "bg-accent text-accent-foreground animate-pulse scale-110",
              winningPattern.length > 0 && !isWinning && "opacity-60"
            )}
            onClick={() => onSquareClick(index)}
            disabled={winningPattern.length > 0}
            aria-pressed={isMarked}
          >
            {isFreeSpace ? "FREE" : entry}
          </Button>
        );
      })}
    </div>
  );
}
