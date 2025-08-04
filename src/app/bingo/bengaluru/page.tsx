
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Users, Gamepad, Dices, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BingoEntryPage() {
  const router = useRouter();
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      setError("Please enter your name to create a game.");
      return;
    }
    setError('');
    // TODO: Implement actual game creation logic
    console.log(`Creating game for ${playerName}`);
    // For now, we'll just navigate to the bingo board page.
    // In the future, this would navigate to a lobby with a new game ID.
    router.push('/bingo/bengaluru/play'); 
  };

  const handleJoinGame = () => {
    if (!playerName.trim() || !gameCode.trim()) {
      setError("Please enter your name and a game code to join.");
      return;
    }
    setError('');
    // TODO: Implement game joining logic
    console.log(`Player ${playerName} joining game ${gameCode}`);
    // For now, we'll just navigate to the bingo board page.
    // In the future, this would validate the game code and navigate to the lobby.
    router.push(`/bingo/bengaluru/play?gameId=${gameCode}`);
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <header className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
           <Dices className="w-16 h-16 text-primary" />
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          Bengaluru Bingo
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">
          The chaotic Bengaluru experience, now in a game.
        </p>
      </header>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Ready to Play?</CardTitle>
          <CardDescription className="text-center">First, tell us your name!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <Input 
              id="player-name"
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="text-center text-lg h-12"
            />
          
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create"><PlusCircle/> Create Game</TabsTrigger>
              <TabsTrigger value="join"><Users/> Join Game</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="text-center space-y-4 pt-4">
                <p className="text-muted-foreground">Start a new game and invite your friends!</p>
                <Button size="lg" className="w-full font-headline" onClick={handleCreateGame}>Create New Game</Button>
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-4">
                <Input
                    id="game-code"
                    placeholder="Enter 4-digit game code"
                    value={gameCode}
                    onChange={(e) => setGameCode(e.target.value)}
                    className="text-center"
                />
                <Button size="lg" className="w-full font-headline" onClick={handleJoinGame}>Join Game</Button>
            </TabsContent>
          </Tabs>

          {error && (
            <p className="text-sm font-medium text-destructive text-center">{error}</p>
          )}

        </CardContent>
      </Card>
    </main>
  );
}
