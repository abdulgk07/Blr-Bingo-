
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BingoCard } from '@/components/bingo-card';
import { BINGO_ENTRIES, generateBingoCard, getWinningPatternIndices } from '@/lib/bingo';
import { validateBingoPattern, type ValidateBingoPatternOutput } from '@/ai/flows/validate-bingo-pattern';
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Dices, RefreshCw, Trash2, CheckCircle } from 'lucide-react';

const FREE_SPACE_INDEX = 12;

export default function BingoPage() {
  const [card, setCard] = useState<string[]>([]);
  const [markedSquares, setMarkedSquares] = useState<boolean[]>(Array(25).fill(false));
  const [winningPattern, setWinningPattern] = useState<number[]>([]);
  const [isChecking, startCheckingTransition] = useTransition();
  const [bingoResult, setBingoResult] = useState<ValidateBingoPatternOutput | null>(null);

  const { toast } = useToast();

  const initializeNewGame = () => {
    const newCard = generateBingoCard(BINGO_ENTRIES);
    setCard(newCard);

    const newMarkedSquares = Array(25).fill(false);
    newMarkedSquares[FREE_SPACE_INDEX] = true; // Pre-mark the "FREE" space
    setMarkedSquares(newMarkedSquares);
    setWinningPattern([]);
    setBingoResult(null);
  };

  useEffect(() => {
    initializeNewGame();
  }, []);

  const handleSquareClick = (index: number) => {
    if (index === FREE_SPACE_INDEX) return; // Prevent unmarking the "FREE" space
    if (winningPattern.length > 0) return; // Game is over

    setMarkedSquares(prev => {
      const newMarked = [...prev];
      newMarked[index] = !newMarked[index];
      return newMarked;
    });
  };

  const handleCheckBingo = () => {
    startCheckingTransition(async () => {
      const result = await validateBingoPattern({ card, markedSquares });
      setBingoResult(result);

      if (result.isValidBingo && result.winningPattern) {
        const indices = getWinningPatternIndices(result.winningPattern);
        setWinningPattern(indices);
        toast({
          title: "BINGO!",
          description: `You got a winning pattern: ${result.winningPattern}`,
        });
      } else {
        setWinningPattern([]);
        toast({
          variant: "destructive",
          title: "Not a BINGO yet...",
          description: "Keep playing! You haven't matched a valid pattern.",
        });
      }
    });
  };

  const handleClearBoard = () => {
    const newMarkedSquares = Array(25).fill(false);
    newMarkedSquares[FREE_SPACE_INDEX] = true;
    setMarkedSquares(newMarkedSquares);
    setWinningPattern([]);
    setBingoResult(null);
  };

  const handleFillBoard = () => {
    setMarkedSquares(Array(25).fill(true));
  };
  
  const handleRandomFill = () => {
    const newMarkedSquares = Array(25).fill(false).map((_, index) => {
        if (index === FREE_SPACE_INDEX) return true;
        return Math.random() > 0.5;
    });
    setMarkedSquares(newMarkedSquares);
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-screen">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">AIC TeamPlay Arena</h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">Mark your squares and get ready to shout BINGO!</p>
      </header>

      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <CardTitle className="font-headline text-2xl">Your Bingo Card</CardTitle>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button variant="outline" size="sm" onClick={initializeNewGame}>
                  <RefreshCw /> New Game
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearBoard}>
                  <Trash2 /> Clear
                </Button>
                <Button variant="outline" size="sm" onClick={handleFillBoard}>
                  Fill All
                </Button>
                 <Button variant="outline" size="sm" onClick={handleRandomFill}>
                  <Dices /> Random
                </Button>
              </div>
            </div>
        </CardHeader>
        <CardContent>
          {card.length > 0 ? (
            <BingoCard 
              card={card}
              markedSquares={markedSquares}
              onSquareClick={handleSquareClick}
              winningPattern={winningPattern}
            />
          ) : (
            <div className="aspect-square w-full flex items-center justify-center bg-muted/50 rounded-md">
              <p>Loading your card...</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6 w-full max-w-2xl flex flex-col items-center gap-4">
        <Button 
          size="lg" 
          className="w-full font-headline text-xl bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleCheckBingo}
          disabled={isChecking || winningPattern.length > 0}
        >
          {isChecking ? <Sparkles className="animate-spin" /> : <CheckCircle />}
          {winningPattern.length > 0 ? 'BINGO Achieved!' : 'Check for BINGO'}
        </Button>
        {bingoResult && (
          <div className={`mt-4 text-center p-4 rounded-md w-full ${bingoResult.isValidBingo ? 'bg-primary/30 text-primary-foreground' : 'bg-destructive/20 text-destructive'}`}>
            <h3 className="font-headline text-lg">{bingoResult.isValidBingo ? 'Validation Result: Success!' : 'Validation Result: Not a BINGO'}</h3>
            <p className="font-body">{bingoResult.isValidBingo ? `Pattern confirmed: ${bingoResult.winningPattern}` : 'No winning pattern detected by our AI assistant.'}</p>
          </div>
        )}
      </div>
    </main>
  );
}
