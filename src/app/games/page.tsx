
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Gamepad2, BrainCircuit } from 'lucide-react';

const games = [
    { 
        city: 'Bengaluru', 
        activities: [
            { name: 'Tech Bingo', description: 'A fun bingo game with AI and tech terms.', path: '/bingo/bengaluru', icon: Gamepad2 },
            { name: 'AI Wish & Worry Board', description: 'A collaborative whiteboard to share your hopes and concerns about AI.', path: '/wish-worry-board', icon: BrainCircuit }
        ] 
    },
    { city: 'General', 
      activities: [
      ]
    },
    { city: 'Delhi', activities: [] },
    { city: 'Mumbai', activities: [] },
    { city: 'Hyderabad', activities: [] },
];

export default function GamesListPage() {
  const router = useRouter();

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">TeamPlay Arena</h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">Choose your activity and let the games begin!</p>
      </header>

      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Game Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible defaultValue="Bengaluru" className="w-full">
            {games.map((game) => (
              <AccordionItem value={game.city} key={game.city}>
                <AccordionTrigger className="text-xl font-headline">
                  <div className="flex items-center gap-2">
                    {game.city === 'General' ? <BrainCircuit className="text-primary"/> : <MapPin className="text-primary"/>}
                    {game.city}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {game.activities.length > 0 ? (
                    <div className="grid gap-4 mt-4">
                      {game.activities.map(activity => (
                        <Card key={activity.name} className="bg-card/80">
                           <CardHeader>
                             <CardTitle className="font-body flex items-center gap-2"><activity.icon/> {activity.name}</CardTitle>
                             <CardDescription>{activity.description}</CardDescription>
                           </CardHeader>
                           <CardContent>
                             <Button onClick={() => router.push(activity.path)}>Play Now</Button>
                           </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center p-4">More games coming soon for {game.city}!</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}
