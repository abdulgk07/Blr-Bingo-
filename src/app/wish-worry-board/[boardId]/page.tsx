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
  Key,
} from "lucide-react";
import { consolidateWishesAndWorries } from "@/lib/openai";
import { useToast } from "@/hooks/use-toast";
import { boardStorage, type Note as StorageNote } from "@/lib/storage";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { ApiKeyInput } from "@/components/api-key-input";

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
  const { isApiKeySet } = useApiKey();
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
        type,
        author: userName,
        authorTitle: userTitle,
        timestamp: new Date(),
      });

      if (type === "wish") {
        setNewWish("");
      } else {
        setNewWorry("");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error",
        description: "Could not add your note. Please try again.",
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
    if (!isApiKeySet) {
      toast({
        title: "API Key Required",
        description: "You need to set your OpenAI API key to use AI features.",
        variant: "destructive",
      });
      return;
    }

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

  // If host doesn't have API key, show API key input
  if (isHost && !isApiKeySet) {
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

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-4">
                <Key className="w-12 h-12 text-orange-600" />
              </div>
              <CardTitle className="font-headline text-2xl">
                API Key Required
              </CardTitle>
              <CardDescription>
                As the host, you need to provide your OpenAI API key to use AI
                consolidation features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeyInput />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

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
            ) : insights ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-green-700">
                    <Lightbulb className="w-4 h-4" /> Wishes Summary
                  </h4>
                  <p className="text-sm bg-green-50 p-3 rounded-md border border-green-200">
                    {insights.wishesSummary}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-orange-700">
                    <AlertTriangle className="w-4 h-4" /> Worries Summary
                  </h4>
                  <p className="text-sm bg-orange-50 p-3 rounded-md border border-orange-200">
                    {insights.worriesSummary}
                  </p>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}

      {/* Input Section */}
      <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
        {/* Wishes Column */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Lightbulb className="w-5 h-5" /> Wishes
            </CardTitle>
            <CardDescription>
              What are your hopes and dreams for AI?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Share your wish for AI..."
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                onClick={() => handleAddNote("wish")}
                disabled={isSubmittingWish || !newWish.trim()}
                className="w-full"
              >
                {isSubmittingWish ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Add Wish
                  </>
                )}
              </Button>
            </div>

            {/* Display Wishes */}
            <div className="space-y-3">
              {wishes.map((wish, index) => (
                <div
                  key={index}
                  className="bg-green-50 border border-green-200 p-3 rounded-lg shadow-sm"
                  style={wish.style}
                >
                  <p className="text-sm text-green-800">{wish.text}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-green-600">
                    <span>{wish.author}</span>
                    <span>{wish.authorTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Worries Column */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="w-5 h-5" /> Worries
            </CardTitle>
            <CardDescription>
              What concerns do you have about AI?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Share your worry about AI..."
                value={newWorry}
                onChange={(e) => setNewWorry(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <Button
                onClick={() => handleAddNote("worry")}
                disabled={isSubmittingWorry || !newWorry.trim()}
                className="w-full"
              >
                {isSubmittingWorry ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Add Worry
                  </>
                )}
              </Button>
            </div>

            {/* Display Worries */}
            <div className="space-y-3">
              {worries.map((worry, index) => (
                <div
                  key={index}
                  className="bg-orange-50 border border-orange-200 p-3 rounded-lg shadow-sm"
                  style={worry.style}
                >
                  <p className="text-sm text-orange-800">{worry.text}</p>
                  <div className="flex items-center justify-between mt-2 text-xs text-orange-600">
                    <span>{worry.author}</span>
                    <span>{worry.authorTitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
