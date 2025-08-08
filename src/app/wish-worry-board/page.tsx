
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { BrainCircuit, Users, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WishWorryBoardEntryPage() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [userTitle, setUserTitle] = useState('');
  const [boardId, setBoardId] = useState('');
  const [error, setError] = useState('');

  const handleCreateBoard = () => {
    if (!userName.trim() || !userTitle.trim()) {
      setError("Please enter your name and title to create a board.");
      return;
    }
    setError('');
    const newBoardId = Math.random().toString(36).substring(2, 8);
    router.push(`/wish-worry-board/${newBoardId}?userName=${encodeURIComponent(userName)}&userTitle=${encodeURIComponent(userTitle)}&isHost=true`);
  };

  const handleJoinBoard = () => {
    if (!userName.trim() || !userTitle.trim() || !boardId.trim()) {
      setError("Please enter all fields to join a board.");
      return;
    }
    setError('');
    router.push(`/wish-worry-board/${boardId}?userName=${encodeURIComponent(userName)}&userTitle=${encodeURIComponent(userTitle)}`);
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <header className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/20 rounded-full mb-4">
           <BrainCircuit className="w-16 h-16 text-primary" />
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          AI Wish & Worry Board
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">
          Collaborate with your team to share your hopes and fears about AI.
        </p>
      </header>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Join or Create a Board</CardTitle>
          <CardDescription className="text-center">First, let's get to know you.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="user-name">Your Name</Label>
                <Input 
                    id="user-name"
                    placeholder="e.g., Ada Lovelace"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="user-title">Your Work Title</Label>
                <Input 
                    id="user-title"
                    placeholder="e.g., Computer Scientist"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                />
            </div>
          
          <Tabs defaultValue="join" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create"><PlusCircle/> Create</TabsTrigger>
              <TabsTrigger value="join"><Users/> Join</TabsTrigger>
            </TabsList>
            <TabsContent value="create" className="text-center space-y-4 pt-4">
                <p className="text-muted-foreground">Start a new board and invite your team!</p>
                <Button size="lg" className="w-full font-headline" onClick={handleCreateBoard}>Create New Board</Button>
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-4">
                <Input
                    id="board-id"
                    placeholder="Enter board ID"
                    value={boardId}
                    onChange={(e) => setBoardId(e.target.value.toLowerCase())}
                    className="text-center"
                />
                <Button size="lg" className="w-full font-headline" onClick={handleJoinBoard}>Join Board</Button>
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
