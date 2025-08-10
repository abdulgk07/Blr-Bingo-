"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Copy, Users, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { gameStorage, playerStorage, type Player } from "@/lib/storage";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { ApiKeyInput } from "@/components/api-key-input";

export const dynamic = "force-dynamic";

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { isApiKeySet } = useApiKey();

  const gameId = params.gameId as string;
  const playerName = searchParams.get("playerName") || "Guest";
  const isHost = searchParams.get("isHost") === "true";

  const [players, setPlayers] = useState<Player[]>([]);
  const [hostName, setHostName] = useState("");

  // Listen for game status changes (e.g., when host starts the game)
  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = gameStorage.subscribeToGame(gameId, (game) => {
      if (game) {
        setHostName(game.hostName);
        if (game.status === "playing" && !isHost) {
          router.push(
            `/bingo/bengaluru/play/${gameId}?playerName=${playerName}`
          );
        }
      }
    });

    // Initial load
    const game = gameStorage.getGame(gameId);
    if (game) {
      setHostName(game.hostName);
    }

    return unsubscribe;
  }, [gameId, router, isHost, playerName]);

  // Listen for players joining/leaving
  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = playerStorage.subscribeToPlayers(
      gameId,
      (playersData) => {
        setPlayers(playersData);
      }
    );

    // Initial load
    const playersData = Object.values(playerStorage.getPlayers(gameId));
    setPlayers(playersData);

    return unsubscribe;
  }, [gameId]);

  const handleCopyGameId = () => {
    const inviteUrl = `${window.location.origin}/bingo/bengaluru?join=${gameId}`;
    navigator.clipboard.writeText(gameId);
    toast({
      title: "Game ID Copied!",
      description: `You can share this ID with your friends.`,
    });
  };

  const handleStartGame = async () => {
    try {
      gameStorage.updateGame(gameId, { status: "playing" });
      router.push(
        `/bingo/bengaluru/play/${gameId}?playerName=${playerName}&isHost=true`
      );
    } catch (error) {
      console.error("Error starting game: ", error);
      toast({
        title: "Error",
        description: "Could not start the game. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getHost = () => players.find((p) => p.isHost);

  // If host doesn't have API key, show API key input
  if (isHost && !isApiKeySet) {
    return (
      <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg shadow-2xl">
          <CardHeader className="text-center">
            <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
              <Key className="w-12 h-12 text-orange-600" />
            </div>
            <CardTitle className="font-headline text-3xl">
              API Key Required
            </CardTitle>
            <CardDescription>
              As the host, you need to provide your OpenAI API key to start the
              game with AI features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <ApiKeyInput />
            <div className="text-sm text-muted-foreground">
              <p>
                Game ID:{" "}
                <span className="font-mono font-bold text-primary">
                  {gameId}
                </span>
              </p>
              <p>Players waiting: {players.length}</p>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Game Lobby</CardTitle>
          <CardDescription>
            Share the game ID with your friends to let them join!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div>
            <p className="text-muted-foreground font-semibold">Game ID</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="font-mono text-4xl font-bold text-primary tracking-widest bg-muted p-3 rounded-lg">
                {gameId}
              </span>
              <Button variant="outline" size="icon" onClick={handleCopyGameId}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-muted-foreground flex items-center justify-center gap-2">
              <Users /> Players Joined ({players.length})
            </h3>
            <div className="h-40 overflow-y-auto bg-muted/50 p-3 rounded-md space-y-2">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="bg-card p-2 rounded-md shadow-sm text-left px-4"
                >
                  {p.name}{" "}
                  {p.isHost && (
                    <span className="font-bold text-primary"> (Host)</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {isHost ? (
            <Button
              size="lg"
              className="w-full font-headline text-xl"
              onClick={handleStartGame}
              disabled={players.length < 2}
            >
              {players.length < 2
                ? "Waiting for players..."
                : "Start Game for Everyone"}
            </Button>
          ) : (
            <p className="text-muted-foreground animate-pulse">
              Waiting for {getHost()?.name || "the host"} to start the game...
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
