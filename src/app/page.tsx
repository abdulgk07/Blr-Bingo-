
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CustomLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-24 h-24 text-primary"
  >
    <path d="M6 12h12" />
    <path d="M12 6v12" />
    <path d="M17.5 17.5L19 19" />
    <path d="M6.5 6.5L5 5" />
    <path d="M17.5 6.5L19 5" />
    <path d="M6.5 17.5L5 19" />
    <circle cx="12" cy="12" r="10" />
  </svg>
);


export default function WelcomePage() {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push('/games');
  };

  return (
    <main className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
       <div className="text-center mb-8">
          <div className="inline-block p-4 bg-primary/20 rounded-full">
            <CustomLogo />
          </div>
          <h1 className="font-headline text-4xl sm:text-5xl md:text-6xl font-bold text-foreground mt-4">
            Welcome to the Ai Collective
          </h1>
          <p className="font-body text-muted-foreground mt-2 text-lg">
            the Worlds largest ai community
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
