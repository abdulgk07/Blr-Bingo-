
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Coffee } from "lucide-react";

export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/games');
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
       <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary/20 rounded-full">
            <Coffee className="w-24 h-24 text-primary" />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mt-4 leading-tight">
            Welcome to
            <br />
            <span className="text-primary">The AI Collective</span>
          </h1>
          <p className="font-body text-muted-foreground mt-3 text-lg">
            The World's Largest AI Community
          </p>
        </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-center">Ready to Play?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-6">
            Jump into our collection of team-building exercises and start collaborating.
          </p>
          <Button 
            size="lg" 
            className="w-full font-headline text-xl bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
