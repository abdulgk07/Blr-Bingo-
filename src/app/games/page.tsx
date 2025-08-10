"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MapPin, Gamepad2, BrainCircuit, Key } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { ApiKeyInput } from "@/components/api-key-input";

const games = [
  {
    city: "Bengaluru",
    activities: [
      {
        name: "Tech Bingo",
        description: "A fun bingo game with AI and tech terms.",
        path: "/bingo/bengaluru",
        icon: Gamepad2,
      },
      {
        name: "AI Wish & Worry Board",
        description:
          "A collaborative whiteboard to share your hopes and concerns about AI.",
        path: "/wish-worry-board",
        icon: BrainCircuit,
      },
    ],
  },
  { city: "General", activities: [] },
  { city: "Delhi", activities: [] },
  { city: "Mumbai", activities: [] },
  { city: "Hyderabad", activities: [] },
];

export default function GamesListPage() {
  const router = useRouter();
  const { isApiKeySet } = useApiKey();

  return (
    <main className="container mx-auto p-4 sm:p-6 md:p-8 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground">
          TeamPlay Arena
        </h1>
        <p className="font-body text-muted-foreground mt-2 text-lg">
          Choose your activity and let the games begin!
        </p>
      </header>

      <Card className="w-full max-w-4xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Game Chapters
          </CardTitle>
          {!isApiKeySet && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
              <div className="flex items-center gap-2 text-orange-800">
                <Key className="h-4 w-4" />
                <span className="text-sm font-medium">API Key Notice</span>
              </div>
              <p className="text-xs text-orange-700 mt-1">
                You can browse and join games without an API key. You'll only
                need one if you want to create games with AI features.
              </p>
              <div className="mt-3">
                <ApiKeyInput />
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Accordion
            type="single"
            collapsible
            defaultValue="Bengaluru"
            className="w-full"
          >
            {games.map((game) => (
              <AccordionItem value={game.city} key={game.city}>
                <AccordionTrigger className="text-xl font-headline">
                  <div className="flex items-center gap-2">
                    {game.city === "General" ? (
                      <MapPin className="w-5 h-5" />
                    ) : (
                      <MapPin className="w-5 h-5" />
                    )}
                    {game.city}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {game.activities.length > 0 ? (
                    <div className="grid gap-4 p-4">
                      {game.activities.map((activity) => (
                        <Card
                          key={activity.name}
                          className="hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <activity.icon className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                  <h3 className="font-headline text-lg font-semibold">
                                    {activity.name}
                                  </h3>
                                  <p className="text-muted-foreground text-sm">
                                    {activity.description}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={() => router.push(activity.path)}
                                className="font-headline"
                              >
                                Play
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-muted-foreground">
                      <p>Coming soon...</p>
                    </div>
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
