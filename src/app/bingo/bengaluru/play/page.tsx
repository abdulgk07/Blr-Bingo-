
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BingoCard } from '@/components/bingo-card';
import { BINGO_ENTRIES, generateBingoCard, checkWin } from '@/lib/bingo';
import { useToast } from "@/hooks/use-toast";
import { Users, Dices, PartyPopper } from 'lucide-react';

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
  status: 'playing', // or 'waiting', 'finished'
};

export default function BingoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isHost = searchParams.get('isHost') === 'true';
  const playerName = searchParams.get('playerName') || 'Player';
  // In a real app, the player ID would be a unique ID from the backend/auth
  const playerId = playerName; 

  const [card, setCard] = useState<string[]>([]);
  const [markedSquares, setMarkedSquares] = useState<boolean[]>([]);
  const [calledPrompts, setCalledPrompts] = useState<string[]>([]);
  const [availablePrompts, setAvailablePrompts] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [players, setPlayers] = useState<{id: string, name: string}[]>([]);

  const { toast } = useToast();

  // Initialize game state from mock data
  useEffect(() => {
    const game = MOCK_GAME_STATE;
    setPlayers(game.players);

    // Only players get a card
    if (!isHost) {
      const newCard = generateBingoCard(BINGO_ENTRIES);
      setCard(newCard);

      const newMarkedSquares = Array(25).fill(false);
      newMarkedSquares[FREE_SPACE_INDEX] = true;
      setMarkedSquares(newMarkedSquares);
    }
    
    setCalledPrompts(game.calledPrompts);
    setAvailablePrompts(game.availablePrompts.filter(p => !game.calledPrompts.includes(p)));

  }, [isHost]);

  // Effect to check for a win whenever the called prompts change
  useEffect(() => {
    if (winner || isHost) return;

    const newMarked = [...markedSquares];
    let changed = false;
    card.forEach((entry, index) => {
      if (calledPrompts.includes(entry) && !newMarked[index]) {
        newMarked[index] = true;
        changed = true;
      }
    });

    if(changed) {
        setMarkedSquares(newMarked);
        if (checkWin(newMarked)) {
            // In a real app, the client would notify the backend they have won.
            // The backend would verify and then update the game state for all players.
            // For now, we simulate this by setting the winner directly.
            setWinner(playerName); 
        }
    }
  }, [calledPrompts, card, isHost, winner, markedSquares, playerName]);
  
  const handleNextPrompt = () => {
    setAvailablePrompts(prevAvail => {
      if (prevAvail.length === 0) return prevAvail;
      
      const newPrompt = prevAvail[Math.floor(Math.random() * prevAvail.length)];
      
      // In a real app, the host would send an update to the backend.
      // The backend would then push the new state to all players.
      setCalledPrompts(prevCalled => [...prevCalled, newPrompt]);
      return prevAvail.filter(p => p !== newPrompt);
    });
  };

  const currentPrompt = calledPrompts.length > 0 ? calledPrompts[calledPrompts.length - 1] : "Waiting for host to start...";

  // ---- RENDER LOGIC ----

  if (winner) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen text-center">
        <PartyPopper className="w-24 h-24 text-accent animate-bounce" />
        <h1 className="font-headline text-5xl font-bold text-foreground mt-4">BINGO!</h1>
        <p className="font-body text-3xl text-muted-foreground mt-2">
            Congratulations, <span className="font-bold text-primary">{winner}</span>!
        </p>
        <Button size="lg" className="mt-8 font-headline" onClick={() => router.push('/games')}>
            Play Another Game
        </Button>
      </main>
    )
  }

  if (isHost) {
    return (
         <main className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-screen">
             <header className="text-center mb-8">
                <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">Host Controls</h1>
                <p className="font-body text-muted-foreground mt-2 text-lg">You are the game master!</p>
            </header>
            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
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
                                {players.map(p => <li key={p.id}>{p.name} {p.id === 'player-1' && '(You)'}</li>)}
                            </ul>
                       </div>
                       <div>
                            <h4 className="font-bold text-muted-foreground flex items-center gap-2"><Dices /> Called Prompts ({calledPrompts.length})</h4>
                            <div className="h-32 overflow-y-auto bg-muted/50 p-2 rounded-md mt-2 text-sm">
                                <ol className="list-decimal list-inside">
                                {calledPrompts.slice().reverse().map(p => <li key={p}>{p}</li>)}
                                </ol>
                            </div>
                       </div>
                    </CardContent>
                </Card>
            </div>
         </main>
    );
  }

  // Default view for Players
  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center min-h-screen">
      <header className="text-center mb-4">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">Bengaluru Bingo</h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">Match the squares to win!</p>
      </header>

       <Card className="w-full max-w-md mb-4 shadow-md">
            <CardContent className="p-4 text-center">
                <p className="font-body text-muted-foreground mb-1">Current Prompt:</p>
                <p className="font-headline text-xl font-bold text-primary truncate">{currentPrompt}</p>
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
            <div className="aspect-square w-full flex items-center justify-center bg-muted/50 rounded-md">
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
                        {calledPrompts.slice().reverse().map(p => <li key={p}>{p}</li>)}
                    </ol>
                </div>
            </CardContent>
       </Card>
    </main>
  );
}
