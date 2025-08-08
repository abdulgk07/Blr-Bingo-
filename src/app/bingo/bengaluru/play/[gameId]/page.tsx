
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BingoCard } from '@/components/bingo-card';
import { BINGO_ENTRIES, generateBingoCard, checkWin } from '@/lib/bingo';
import { useToast } from "@/hooks/use-toast";
import { Users, Dices, PartyPopper, Crown, Smartphone } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const dynamic = 'force-dynamic';

const FREE_SPACE_INDEX = 12;

// Mock game state for demonstration purposes
// In a real app, this would come from a backend like Firebase
const MOCK_GAME_STATE = {
  id: 'ABCD',
  hostId: 'player-1',
  players: [
    { id: 'player-1', name: 'Host' },
    { id: 'player-2', name: 'Ravi' },
    { id: 'player-3', name: 'Priya' },
  ],
  calledPrompts: [] as string[],
  availablePrompts: BINGO_ENTRIES,
  winner: null as string | null,
  status: 'playing', // 'waiting', 'playing', 'finished'
  bingoCallers: [] as string[], // Players who have a winning pattern
};

const BACKGROUND_WORDS = [
    "Peak Bengaluru Life",
    "Tech & AI Culture",
    "Family & Everyday Life",
    "Workplace & Office Culture",
    "Bollywood & Entertainment",
    "Monsoons & Weather",
    "General AI Clichés",
    "Auto driver says, 'Cash only.'",
    "Startup promises chai delivery by drone",
    "The algorithm is blamed for everything"
];

function BackgroundWords() {
    const [styles, setStyles] = useState<React.CSSProperties[]>([]);

    useEffect(() => {
        const generatedStyles = BACKGROUND_WORDS.map(() => ({
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90 - 20}%`,
            transform: `rotate(${Math.random() * 60 - 30}deg)`,
            opacity: '0.05',
        }));
        setStyles(generatedStyles);
    }, []);

    if (styles.length === 0) {
        return null;
    }

    return (
        <div className="absolute inset-0 -z-10 h-full w-full overflow-hidden">
            <div className="relative h-full w-full">
                {BACKGROUND_WORDS.map((word, index) => (
                    <span
                        key={index}
                        className="absolute font-headline text-6xl lg:text-8xl font-extrabold text-muted-foreground whitespace-nowrap"
                        style={styles[index]}
                    >
                        {word}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function BingoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const gameId = params.gameId as string;
  const isHost = searchParams.get('isHost') === 'true';
  const playerName = searchParams.get('playerName') || 'Player';
  // In a real app, the player ID would be a unique ID from the backend/auth
  const playerId = isHost ? 'player-1' : playerName; 

  const [card, setCard] = useState<string[]>([]);
  const [markedSquares, setMarkedSquares] = useState<boolean[]>([]);
  const [calledPrompts, setCalledPrompts] = useState<string[]>([]);
  const [availablePrompts, setAvailablePrompts] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<{id: string, name: string}[]>([]);
  const [bingoCallers, setBingoCallers] = useState<string[]>([]);

  const { toast } = useToast();

  // MOCK: Initialize game state from mock data
  useEffect(() => {
    const game = MOCK_GAME_STATE;
    setPlayers(game.players);

    // All players (including host for dev purposes) get a card, but UI will differ
    const newCard = generateBingoCard(BINGO_ENTRIES);
    setCard(newCard);

    const newMarkedSquares = Array(25).fill(false);
    newMarkedSquares[FREE_SPACE_INDEX] = true;
    setMarkedSquares(newMarkedSquares);
    
    setCalledPrompts(game.calledPrompts);
    setAvailablePrompts(game.availablePrompts);
    setWinner(game.winner);

  }, []);
  
  // MOCK: System acts as host for testing purposes, calling a prompt every 2 seconds
  useEffect(() => {
    // Only run for the mock game (not a real host) and if there's no winner yet.
    if (isHost) return;

    const interval = setInterval(() => {
        if (winner) {
            clearInterval(interval);
            return;
        }
  
        setAvailablePrompts(prevAvail => {
          if (prevAvail.length === 0) {
            clearInterval(interval);
            return prevAvail;
          }
          
          const newPromptIndex = Math.floor(Math.random() * prevAvail.length);
          const newPrompt = prevAvail[newPromptIndex];
          
          setCalledPrompts(prevCalled => [...prevCalled, newPrompt]);
  
          return prevAvail.filter((_, index) => index !== newPromptIndex);
        });
  
    }, 2000);
  
    return () => clearInterval(interval);
  }, [isHost, winner]);


  // Effect for players to check for a win whenever their card or prompts change
  const handlePlayerWinCheck = useCallback(() => {
    if (winner || isHost || card.length === 0) return;

    const newMarked = [...markedSquares];
    let changed = false;
    card.forEach((entry, index) => {
      if (calledPrompts.includes(entry) && !newMarked[index]) {
        newMarked[index] = true;
        changed = true;
      }
    });

    if (changed) {
      setMarkedSquares(newMarked);
      if (checkWin(newMarked)) {
          // Player has bingo! Let the host know.
          // In a real app, this would be an event sent to the backend.
          // For the mock, we just update the local state.
          if (!bingoCallers.includes(playerName)) {
              setBingoCallers(prev => [...prev, playerName]);
              toast({
                  title: "BINGO!",
                  description: "Waiting for the host to verify your win.",
              });
              // For the mock game, automatically declare the player as the winner
              if (!isHost) {
                  setWinner(playerName);
              }
          }
      }
    }
  }, [calledPrompts, card, isHost, winner, markedSquares, playerName, toast, bingoCallers]);

  useEffect(() => {
    handlePlayerWinCheck();
  }, [calledPrompts, handlePlayerWinCheck]);

  // Handler for the HOST to call the next prompt manually
  const handleNextPrompt = () => {
    if (winner) return;

    setAvailablePrompts(prevAvail => {
      if (prevAvail.length === 0) {
        toast({ title: "No more prompts!", variant: "destructive" });
        return prevAvail;
      }
      
      const newPromptIndex = Math.floor(Math.random() * prevAvail.length);
      const newPrompt = prevAvail[newPromptIndex];
      
      // In a real app, the host would send an update to the backend.
      if(isHost) {
        setCalledPrompts(prevCalled => [...prevCalled, newPrompt]);
      }
      return prevAvail.filter((_, index) => index !== newPromptIndex);
    });
  };

  // Handler for the HOST to declare a winner
  const handleDeclareWinner = (winnerName: string) => {
      // In a real app, this would update the game state for all players.
      setWinner(winnerName);
  };

  const currentPrompt = calledPrompts.length > 0 ? calledPrompts[calledPrompts.length - 1] : "Waiting for host to start...";

  // ---- RENDER LOGIC ----

  if (winner) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen text-center bg-background">
        <BackgroundWords />
        <div className="relative">
          <Crown className="w-32 h-32 text-amber-400 absolute -top-24 -left-16 transform -rotate-12" />
          <PartyPopper className="w-24 h-24 text-primary animate-bounce" />
        </div>
        <h1 className="font-headline text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mt-4 animate-pulse">
            BINGO!
        </h1>
        <p className="font-body text-3xl text-muted-foreground mt-4">
            Congratulations, <span className="font-bold text-primary">{winner}</span>!
        </p>
        <Button size="lg" className="mt-12 font-headline text-xl" onClick={() => router.push('/bingo/bengaluru')}>
            Play Another Game
        </Button>
      </main>
    )
  }

  // Common wrapper for game screens to handle orientation lock
  return (
      <div className="landscape-only-bingo">
          <div className="orientation-lock">
                <Smartphone className="w-16 h-16 mb-4 animate-pulse" />
                <h2 className="text-2xl font-bold font-headline">Please rotate your device</h2>
                <p className="text-lg mt-2 font-body">This game is best played in landscape mode.</p>
          </div>
          <div className="main-game-content relative">
              <BackgroundWords />
              {isHost ? (
                <main className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-screen">
                    <header className="text-center mb-8">
                        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Host Controls</h1>
                        <p className="font-body text-muted-foreground mt-2 text-lg">You are the game master!</p>
                    </header>
                    <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl">
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Game Control</CardTitle>
                                <CardDescription>Click the button to call the next bingo prompt for all players.</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center space-y-4">
                                <div className="bg-muted p-4 rounded-lg shadow-inner min-h-[80px] flex items-center justify-center">
                                    <p className="text-2xl font-semibold text-foreground">{currentPrompt}</p>
                                </div>
                                <Button 
                                    size="lg" 
                                    className="w-full font-headline" 
                                    onClick={handleNextPrompt}
                                    disabled={availablePrompts.length === 0 || !!winner}
                                >
                                {winner ? 'Game Over' : 'Call Next Prompt'}
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Game Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            <div>
                                    <h4 className="font-bold text-muted-foreground flex items-center gap-2"><Users /> Players ({players.length})</h4>
                                    <ul className="list-disc pl-5 mt-2 text-foreground">
                                        {players.map(p => <li key={p.id}>{p.name} {p.id === playerId && '(You)'}</li>)}
                                    </ul>
                            </div>

                            {bingoCallers.length > 0 && !winner && (
                                <div className="bg-destructive/20 border-l-4 border-destructive p-4 rounded-r-lg">
                                    <h4 className="font-bold text-destructive-foreground">Bingo Called!</h4>
                                    <p className="text-sm text-muted-foreground mb-2">A player has a winning card. Verify and declare the winner!</p>
                                    <div className="space-y-2">
                                        {bingoCallers.map(name => (
                                        <AlertDialog key={name}>
                                            <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">Declare {name} as Winner!</Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                This will end the game for everyone and declare {name} as the winner. This action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeclareWinner(name)}>
                                                Confirm Winner
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                    <h4 className="font-bold text-muted-foreground flex items-center gap-2"><Dices /> Called Prompts ({calledPrompts.length})</h4>
                                    <div className="h-24 overflow-y-auto bg-muted/50 p-2 rounded-md mt-2 text-sm">
                                        <ol className="list-decimal list-inside">
                                        {calledPrompts.slice().reverse().map((p, i) => <li key={`${p}-${i}-host`}>{p}</li>)}
                                        </ol>
                                    </div>
                            </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
              ) : (
                // Default view for Players
                <main className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-screen">
                <header className="text-center mb-4">
                    <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Bengaluru Bingo</h1>
                    <p className="font-body text-muted-foreground mt-2 text-lg">Match the squares to win!</p>
                </header>

                <Card className="w-full max-w-md mb-4 shadow-md">
                        <CardContent className="p-4 text-center">
                            <p className="font-body text-muted-foreground mb-1">Current Prompt:</p>
                            <p className="font-headline text-xl font-bold text-accent truncate">{currentPrompt}</p>
                        </CardContent>
                </Card>

                <div className="w-full max-w-2xl">
                    {card.length > 0 ? (
                        <BingoCard 
                        card={card}
                        markedSquares={markedSquares}
                        onSquareClick={() => {}} // Clicking is disabled
                        winningPattern={[]}
                        />
                    ) : (
                        <div className="aspect-square w-full flex items-center justify-center bg-muted/50 rounded-md border">
                        <p>Loading your card...</p>
                        </div>
                    )}
                </div>

                <Card className="w-full max-w-md mt-4 shadow-md">
                    <CardHeader className="p-4">
                        <CardTitle className="font-body text-center text-sm text-muted-foreground">Called Prompts ({calledPrompts.length})</CardTitle>
                    </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <div className="h-24 overflow-y-auto bg-muted/50 p-2 rounded-md text-sm">
                                <ol className="list-decimal list-inside">
                                    {calledPrompts.slice().reverse().map((p, i) => <li key={`${p}-${i}-player`}>{p}</li>)}
                                </ol>
                            </div>
                        </CardContent>
                </Card>
                </main>
              )}
          </div>
      </div>
  );
}
