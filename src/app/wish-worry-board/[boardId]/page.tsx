"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BrainCircuit,
  Lightbulb,
  AlertTriangle,
  Send,
  Loader2,
} from "lucide-react";
import { consolidateWishesAndWorries } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { boardStorage, type Note as StorageNote } from "@/lib/storage";

export const dynamic = "force-dynamic";

// Use the storage Note type with local styling
type Note = StorageNote & {
  style: React.CSSProperties;
};

interface Insights {
  wishesSummary: string;
  worriesSummary: string;
}

export default function WishWorryBoardPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const boardId = params.boardId as string;

  const userName = searchParams.get("userName") || "Anonymous";
  const userTitle = searchParams.get("userTitle") || "Participant";
  const isHost = searchParams.get("isHost") === "true";

  const [wishes, setWishes] = useState<Note[]>([]);
  const [worries, setWorries] = useState<Note[]>([]);
  const [newWish, setNewWish] = useState("");
  const [newWorry, setNewWorry] = useState("");
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [isSubmittingWorry, setIsSubmittingWorry] = useState(false);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isConsolidating, setIsConsolidating] = useState(false);

  const getRandomRotation = () => ({
    transform: `rotate(${Math.random() * 6 - 3}deg)`,
  });

  // Set up real-time listener for notes
  useEffect(() => {
    if (!boardId) return;

    const unsubscribe = boardStorage.subscribeToBoard(
      boardId,
      (allNotes: StorageNote[]) => {
        const notesWithStyle = allNotes.map((note) => ({
          ...note,
          style: getRandomRotation(),
        }));
        setWishes(notesWithStyle.filter((n) => n.type === "wish"));
        setWorries(notesWithStyle.filter((n) => n.type === "worry"));
      }
    );

    // Initial load
    const board = boardStorage.getBoard(boardId);
    const notesWithStyle = board.notes.map((note) => ({
      ...note,
      style: getRandomRotation(),
    }));
    setWishes(notesWithStyle.filter((n) => n.type === "wish"));
    setWorries(notesWithStyle.filter((n) => n.type === "worry"));

    return unsubscribe;
  }, [boardId, toast]);

  const handleAddNote = async (type: "wish" | "worry") => {
    const text = type === "wish" ? newWish : newWorry;
    if (!text.trim()) return;

    if (type === "wish") {
      setIsSubmittingWish(true);
    } else {
      setIsSubmittingWorry(true);
    }

    try {
      boardStorage.addNote(boardId, {
        text: text.trim(),
        author: userName,
        authorTitle: userTitle,
        type: type,
      });

      if (type === "wish") {
        setNewWish("");
      } else {
        setNewWorry("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Submission Failed",
        description: "Your note could not be saved. Please try again.",
        variant: "destructive",
      });
    } finally {
      if (type === "wish") {
        setIsSubmittingWish(false);
      } else {
        setIsSubmittingWorry(false);
      }
    }
  };

  const handleConsolidate = async () => {
    setIsConsolidating(true);
    setInsights(null);

    try {
      const wishTexts = wishes.map((w) => w.text);
      const worryTexts = worries.map((w) => w.text);

      if (wishTexts.length === 0 && worryTexts.length === 0) {
        toast({
          title: "Board is Empty",
          description: "Add some wishes or worries before consolidating.",
          variant: "destructive",
        });
        setIsConsolidating(false);
        return;
      }

      const result = await consolidateWishesAndWorries({
        wishes: wishTexts,
        worries: worryTexts,
      });

      setInsights(result);
    } catch (error) {
      console.error("Error consolidating insights:", error);
      toast({
        title: "AI Analysis Failed",
        description: "Could not generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConsolidating(false);
    }
  };

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-muted/20">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">
          AI Wish &amp; Worry Board
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">
          Board ID:{" "}
          <span className="font-mono bg-muted p-1 rounded">{boardId}</span>
        </p>
      </header>

      {/* AI Insights Section - For Host */}
      {isHost && (
        <Card className="mb-8 shadow-md">
          <CardContent className="p-6 text-center">
            <Button
              size="lg"
              onClick={handleConsolidate}
              disabled={isConsolidating}
            >
              {isConsolidating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />{" "}
                  Consolidating...
                </>
              ) : (
                <>
                  <BrainCircuit className="mr-2 h-5 w-5" />{" "}
                  {insights
                    ? "Re-Consolidate Insights"
                    : "Consolidate &amp; Show Insights"}
                </>
              )}
            </Button>
            <CardDescription className="mt-2">
              Click to analyze all entries and reveal themes.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Display AI Insights - For all users once available */}
      {(isConsolidating || insights) && (
        <Card className="mb-8 shadow-md animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BrainCircuit /> AI Insights
            </CardTitle>
            <CardDescription>
              Top themes based on the team's input.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isConsolidating ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
              </div>
            ) : (
              insights && (
                <div className="flex flex-wrap gap-4 text-sm">
                  {insights.wishesSummary && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 p-2 rounded-md">
                      <Lightbulb className="w-4 h-4" /> <strong>Wishes:</strong>{" "}
                      {insights.wishesSummary}
                    </div>
                  )}
                  {insights.worriesSummary && (
                    <div className="flex items-center gap-2 bg-red-100 text-red-800 p-2 rounded-md">
                      <AlertTriangle className="w-4 h-4" />{" "}
                      <strong>Worries:</strong> {insights.worriesSummary}
                    </div>
                  )}
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}

      {/* Wishes and Worries Columns */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Wishes Column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-headline text-green-600 flex items-center gap-2">
            <Lightbulb /> My AI Wishes
          </h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              <Textarea
                placeholder="What are you hopeful about with AI?"
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                disabled={isSubmittingWish}
              />
              <Button
                onClick={() => handleAddNote("wish")}
                disabled={isSubmittingWish}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isSubmittingWish ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Add Wish
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            {wishes.map((note) => (
              <Card
                key={note.id}
                className="shadow-sm bg-green-50/50"
                style={note.style}
              >
                <CardContent className="p-4">
                  <p className="text-card-foreground">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    - {note.author}, {note.authorTitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Worries Column */}
        <div className="space-y-4">
          <h2 className="text-2xl font-headline text-red-600 flex items-center gap-2">
            <AlertTriangle /> My AI Worries
          </h2>
          <Card>
            <CardContent className="p-4 space-y-2">
              <Textarea
                placeholder="What are your concerns about AI?"
                value={newWorry}
                onChange={(e) => setNewWorry(e.target.value)}
                disabled={isSubmittingWorry}
              />
              <Button
                onClick={() => handleAddNote("worry")}
                variant="destructive"
                disabled={isSubmittingWorry}
                className="w-full"
              >
                {isSubmittingWorry ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Add Worry
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          <div className="space-y-4">
            {worries.map((note) => (
              <Card
                key={note.id}
                className="shadow-sm bg-red-50/50"
                style={note.style}
              >
                <CardContent className="p-4">
                  <p className="text-card-foreground">{note.text}</p>
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    - {note.author}, {note.authorTitle}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
