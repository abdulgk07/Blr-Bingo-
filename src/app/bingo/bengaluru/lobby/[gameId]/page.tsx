
"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Copy, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

// Mock player list for demonstration
const MOCK_PLAYERS = [
    { id: 'player-1', name: 'Host' },
    { id: 'player-2', name: 'Ravi' },
];

export default function LobbyPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { toast } = useToast();

    const gameId = params.gameId as string;
    const playerName = searchParams.get('playerName') || 'Guest';
    const isHost = searchParams.get('isHost') === 'true';

    const [players, setPlayers] = useState(MOCK_PLAYERS);

    // In a real app, this would use a real-time listener (e.g., WebSockets or Firebase)
    // to update the player list as people join.
    useEffect(() => {
        // Simulate a new player joining after a delay
        const timer = setTimeout(() => {
            if (players.length < 5 && !players.find(p => p.name === 'Priya')) {
                setPlayers(prev => [...prev, {id: 'player-3', name: 'Priya'}]);
            }
        }, 3000);

        // If the user is a new player (not host), add them to the list
        // This is a mock, a real backend would handle this
        const playerExists = players.some(p => p.name === playerName);
        if (!playerExists) {
            setPlayers(prev => [...prev, {id: playerName, name: playerName}]);
        }
        
        return () => clearTimeout(timer);
    }, [playerName, players]);

    const handleCopyGameId = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(gameId);
            toast({
                title: "Game ID Copied!",
                description: "The game ID has been copied to your clipboard.",
            });
        }
    };

    const handleStartGame = () => {
        // Navigate all players to the game screen.
        // In a real app, the host would send a "start" event to the backend,
        // and the backend would push this navigation to all connected clients.
        // Here, we just navigate the host and assume others will follow.
        router.push(`/bingo/bengaluru/play/${gameId}?isHost=true&playerName=${playerName}`);
    };

    return (
        <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
            <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="font-headline text-3xl">Game Lobby</CardTitle>
                    <CardDescription>Share the game ID with your friends to let them join!</CardDescription>
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
                        <h3 className="font-bold text-muted-foreground flex items-center justify-center gap-2"><Users /> Players Joined ({players.length})</h3>
                        <div className="h-40 overflow-y-auto bg-muted/50 p-3 rounded-md space-y-2">
                            {players.map(p => (
                                <div key={p.id} className="bg-card p-2 rounded-md shadow-sm text-left px-4">
                                    {p.name} {p.id === 'player-1' && <span className="font-bold text-primary">(Host)</span>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {isHost ? (
                        <Button size="lg" className="w-full font-headline text-xl" onClick={handleStartGame}>
                            Start Game for Everyone
                        </Button>
                    ) : (
                        <p className="text-muted-foreground animate-pulse">
                            Waiting for the host to start the game...
                        </p>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
