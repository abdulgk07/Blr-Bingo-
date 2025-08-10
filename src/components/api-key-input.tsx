"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Eye, EyeOff, Key, AlertCircle } from "lucide-react";
import { useApiKey } from "@/contexts/ApiKeyContext";
import { useToast } from "@/hooks/use-toast";

export function ApiKeyInput() {
  const [showKey, setShowKey] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey, setApiKey, isApiKeySet, clearApiKey } = useApiKey();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) return;

    setIsLoading(true);

    try {
      // Test the API key by making a simple request
      const response = await fetch("/api/test-api-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ apiKey: inputKey }),
      });

      if (response.ok) {
        setApiKey(inputKey);
        setInputKey("");
        toast({
          title: "API Key Set Successfully",
          description: "Your OpenAI API key has been configured and saved.",
        });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Invalid API key");
      }
    } catch (error) {
      toast({
        title: "Invalid API Key",
        description:
          error instanceof Error
            ? error.message
            : "Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    toast({
      title: "API Key Cleared",
      description: "Your API key has been removed.",
    });
  };

  if (isApiKeySet) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-green-600" />
            API Key Configured
          </CardTitle>
          <CardDescription>
            Your OpenAI API key is set and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            <span className="text-sm text-green-800">API Key is active</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowKey(!showKey)}
              className="flex-1"
            >
              {showKey ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showKey ? "Hide" : "Show"} Key
            </Button>
            <Button
              variant="destructive"
              onClick={handleClearKey}
              className="flex-1"
            >
              Clear Key
            </Button>
          </div>
          {showKey && (
            <div className="p-3 bg-gray-50 border rounded-md">
              <code className="text-sm break-all">{apiKey}</code>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-orange-600" />
          OpenAI API Key Required
        </CardTitle>
        <CardDescription>
          Enter your OpenAI API key to enable AI features. This key is stored
          locally and never shared.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="pr-10"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium">Security Note:</p>
              <p>
                Your API key is stored locally in your browser and never sent to
                our servers. Only you can see and use your key.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !inputKey.trim()}
          >
            {isLoading ? "Validating..." : "Set API Key"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
