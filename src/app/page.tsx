
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const CustomLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className="w-24 h-24 text-primary"
    fill="currentColor"
  >
    <path
      d="M62.4,22.9C52.9,19.3,42.5,20.4,33.5,25.6C24.5,30.8,18,39.5,15.8,49.5C13.6,59.5,15.8,70,21.8,78.5
        C27.8,87,37.1,92.5,47.2,93.9C57.3,95.3,67.6,92.5,75.9,86.1C84.2,79.7,89.6,70.1,91.1,59.5
        C92.6,48.9,90,38.3,83.9,30.1C82,27.5,79.8,25.2,77.3,23.4C74.2,21.2,70.7,19.6,67,18.7
        C67,18.7,67,18.7,67,18.7C63.6,17.8,60.1,17.6,56.6,18.2C49.5,19.4,43,23.3,38.6,29.1
        C34.2,34.9,32.4,42.3,33.7,49.5C35,56.7,39.3,63.2,45.6,67.2C51.9,71.2,59.6,72.4,66.6,70.5
        C73.6,68.6,79.3,63.8,82.4,57.3C83.9,54.1,84.7,50.6,84.7,47.1"
      stroke="hsl(var(--foreground))"
      strokeWidth="10"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
