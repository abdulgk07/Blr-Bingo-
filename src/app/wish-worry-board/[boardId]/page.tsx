
"use client";

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { BrainCircuit, Lightbulb, AlertTriangle, Send, Loader2 } from 'lucide-react';

// Mock data structure
interface Note {
    id: string;
    text: string;
    author: string;
    authorTitle: string;
    style: React.CSSProperties;
}

interface Insights {
    wishes: string;
    worries: string;
}

const MOCK_WISHES: Note[] = [
    { id: 'w1', text: 'I hope AI can cure diseases faster.', author: 'Marie Curie', authorTitle: 'Physicist', style: { transform: 'rotate(-2deg)' } },
    { id: 'w2', text: 'AI-powered personalized education for every child.', author: 'Sal Khan', authorTitle: 'Educator', style: { transform: 'rotate(1.5deg)' } },
];
const MOCK_WORRIES: Note[] = [
    { id: 'r1', text: 'Worried about job displacement for creative roles.', author: 'Vincent van Gogh', authorTitle: 'Artist', style: { transform: 'rotate(2deg)' } },
    { id: 'r2', text: 'The potential for AI to be used for autonomous weapons is scary.', author: 'Alfred Nobel', authorTitle: 'Inventor', style: { transform: 'rotate(-1deg)' } },
    { id: 'r3', text: 'Privacy concerns with AI learning from our personal data.', author: 'George Orwell', authorTitle: 'Novelist', style: { transform: 'rotate(3deg)' } },
];

export default function WishWorryBoardPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const boardId = params.boardId as string;
    
    const userName = searchParams.get('userName') || 'Anonymous';
    const userTitle = searchParams.get('userTitle') || 'Participant';
    const isHost = searchParams.get('isHost') === 'true';

    const [wishes, setWishes] = useState<Note[]>(MOCK_WISHES);
    const [worries, setWorries] = useState<Note[]>(MOCK_WORRIES);
    const [newWish, setNewWish] = useState('');
    const [newWorry, setNewWorry] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(''); // 'wish' or 'worry'
    const [insights, setInsights] = useState<Insights | null>(null);
    const [isConsolidating, setIsConsolidating] = useState(false);


    const getRandomRotation = () => ({
        transform: `rotate(${Math.random() * 6 - 3}deg)`
    });

    const handleAddNote = (type: 'wish' | 'worry') => {
        if (type === 'wish' && !newWish.trim()) return;
        if (type === 'worry' && !newWorry.trim()) return;
        
        setIsSubmitting(type);

        // In a real app, this would send data to Firestore.
        // Here, we simulate it with a timeout and update local state.
        setTimeout(() => {
            const newNote: Note = {
                id: Math.random().toString(36).substring(2, 9),
                text: type === 'wish' ? newWish : newWorry,
                author: userName,
                authorTitle: userTitle,
                style: getRandomRotation()
            };

            if (type === 'wish') {
                setWishes(prev => [newNote, ...prev]);
                setNewWish('');
            } else {
                setWorries(prev => [newNote, ...prev]);
                setNewWorry('');
            }
            setIsSubmitting('');
        }, 1000);
    };

    const handleConsolidate = () => {
        setIsConsolidating(true);
        // In a real app, you would gather all wishes and worries
        // and send them to your AI Genkit flow.
        setTimeout(() => {
            setInsights({
                wishes: "Personalized Learning (2), Medical Breakthroughs (1)",
                worries: "Job Displacement (1), Privacy (1), Autonomous Weapons (1)"
            });
            setIsConsolidating(false);
        }, 2000);
    };


    return (
        <main className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen bg-muted/20">
            <header className="text-center mb-8">
                <h1 className="font-headline text-4xl sm:text-5xl font-bold text-foreground">AI Wish & Worry Board</h1>
                <p className="font-body text-muted-foreground mt-2 text-lg">Board ID: <span className="font-mono bg-muted p-1 rounded">{boardId}</span></p>
            </header>

            {/* AI Insights Section - For Host */}
            {isHost && (
                 <Card className="mb-8 shadow-md">
                     <CardContent className="p-6 text-center">
                         <Button size="lg" onClick={handleConsolidate} disabled={isConsolidating}>
                             {isConsolidating ? (
                                 <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Consolidating...</>
                             ) : (
                                 <><BrainCircuit className="mr-2 h-5 w-5" /> {insights ? 'Re-Consolidate Insights' : 'Consolidate & Show Insights'}</>
                             )}
                         </Button>
                         <CardDescription className="mt-2">Click to analyze all entries and reveal themes.</CardDescription>
                     </CardContent>
                 </Card>
            )}

            {/* Display AI Insights - For all users once available */}
            {insights && (
                <Card className="mb-8 shadow-md animate-in fade-in">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-headline"><BrainCircuit /> AI Insights</CardTitle>
                        <CardDescription>Top themes based on the team's input.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 bg-green-100 text-green-800 p-2 rounded-md">
                            <Lightbulb className="w-4 h-4"/> <strong>Wishes:</strong> {insights.wishes}
                            </div>
                            <div className="flex items-center gap-2 bg-red-100 text-red-800 p-2 rounded-md">
                                <AlertTriangle className="w-4 h-4" /> <strong>Worries:</strong> {insights.worries}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}


            {/* Wishes and Worries Columns */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Wishes Column */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-headline text-green-600 flex items-center gap-2"><Lightbulb /> My AI Wishes</h2>
                    <Card>
                        <CardContent className="p-4 space-y-2">
                            <Textarea 
                                placeholder="What are you hopeful about with AI?"
                                value={newWish}
                                onChange={(e) => setNewWish(e.target.value)}
                                disabled={!!isSubmitting}
                            />
                            <Button onClick={() => handleAddNote('wish')} disabled={isSubmitting === 'wish'} className="w-full bg-green-600 hover:bg-green-700">
                                {isSubmitting === 'wish' ? 'Adding...' : <><Send className="mr-2 h-4 w-4"/> Add Wish</>}
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="space-y-4">
                        {wishes.map(note => (
                            <Card key={note.id} className="shadow-sm bg-green-50/50" style={note.style}>
                                <CardContent className="p-4">
                                    <p className="text-card-foreground">{note.text}</p>
                                    <p className="text-xs text-muted-foreground mt-2 text-right">- {note.author}, {note.authorTitle}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Worries Column */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-headline text-red-600 flex items-center gap-2"><AlertTriangle /> My AI Worries</h2>
                     <Card>
                        <CardContent className="p-4 space-y-2">
                            <Textarea 
                                placeholder="What are your concerns about AI?"
                                value={newWorry}
                                onChange={(e) => setNewWorry(e.target.value)}
                                disabled={!!isSubmitting}
                            />
                            <Button onClick={() => handleAddNote('worry')} variant="destructive" disabled={isSubmitting === 'worry'} className="w-full">
                                {isSubmitting === 'worry' ? 'Adding...' : <><Send className="mr-2 h-4 w-4"/> Add Worry</>}
                            </Button>
                        </CardContent>
                    </Card>
                    <div className="space-y-4">
                        {worries.map(note => (
                            <Card key={note.id} className="shadow-sm bg-red-50/50" style={note.style}>
                                <CardContent className="p-4">
                                    <p className="text-card-foreground">{note.text}</p>
                                    <p className="text-xs text-muted-foreground mt-2 text-right">- {note.author}, {note.authorTitle}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
