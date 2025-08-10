"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Dices, PlusCircle, Users, Key, TestTube } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { ApiKeyInput } from "@/components/api-key-input";

export default function BingoEntryPage() {
  const router = useRouter();
  const { isApiKeySet } = useApiKey();
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [activeTab, setActiveTab] = useState<"create" | "join">("join");
  const [error, setError] = useState("");

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError("Please enter your name to create a game.");
      return;
    }
    if (!isApiKeySet) {
      setError(
        "You need to provide an OpenAI API key to create a game with AI features."
      );
      return;
    }
    setError("");
    const newGameId = Math.floor(1000 + Math.random() * 9000).toString();
    router.push(
      `/bingo/bengaluru/lobby/${newGameId}?playerName=${encodeURIComponent(
        playerName
      )}&isHost=true`
    );
  };

  const handleJoinGame = async () => {
    if (!playerName.trim() || !gameId.trim()) {
      setError("Please enter your name and the game ID to join.");
      return;
    }
    setError("");
    router.push(
      `/bingo/bengaluru/lobby/${gameId}?playerName=${encodeURIComponent(
        playerName
      )}&isHost=false`
    );
  };

  const handleMockGame = () => {
    const mockPlayerName = playerName.trim() || "Tester";
    const mockGameId = "MOCK";
    router.push(
      `/bingo/bengaluru/play/${mockGameId}?playerName=${mockPlayerName}&isHost=false`
    );
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
          <CardTitle className="font-headline text-2xl text-center">
            Ready to Play?
          </CardTitle>
          <CardDescription className="text-center">
            First, tell us your name!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            id="player-name"
            placeholder="Enter your name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="text-center text-lg h-12"
          />

          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "create" | "join")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">
                <PlusCircle /> Create Game
              </TabsTrigger>
              <TabsTrigger value="join">
                <Users /> Join Game
              </TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="text-center space-y-4 pt-4">
              <p className="text-muted-foreground">
                Start a new game and invite your friends!
              </p>
              {!isApiKeySet && (
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
                  <div className="flex items-center gap-2 text-orange-800">
                    <Key className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      API Key Required
                    </span>
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    You need an OpenAI API key to create games with AI features.
                  </p>
                  <div className="mt-3">
                    <ApiKeyInput />
                  </div>
                </div>
              )}
              <Button
                size="lg"
                className="w-full font-headline"
                onClick={handleCreateGame}
                disabled={!isApiKeySet}
              >
                {isApiKeySet ? "Create New Game" : "Set API Key First"}
              </Button>
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-4">
              <Input
                id="game-id"
                placeholder="Enter 4-digit game ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="text-center"
                type="number"
              />
              <Button
                size="lg"
                className="w-full font-headline"
                onClick={handleJoinGame}
              >
                Join Game
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                No API key needed to join games as a player!
              </p>
            </TabsContent>
          </Tabs>

          {error && (
            <p className="text-sm font-medium text-destructive text-center">
              {error}
            </p>
          )}

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t"></div>
            <span className="flex-shrink mx-4 text-xs text-muted-foreground">
              FOR TESTING
            </span>
            <div className="flex-grow border-t"></div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleMockGame}>
            <TestTube className="w-4 h-4 mr-2" />
            Test the Game
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
