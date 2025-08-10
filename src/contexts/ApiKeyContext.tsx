"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isApiKeySet: boolean;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>("");

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    // Store in localStorage for persistence during the session
    if (typeof window !== "undefined") {
      localStorage.setItem("openai_api_key", key);
    }
  };

  const clearApiKey = () => {
    setApiKeyState("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("openai_api_key");
    }
  };

  // Load API key from localStorage on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("openai_api_key");
      if (storedKey) {
        setApiKeyState(storedKey);
      }
    }
  }, []);

  const value: ApiKeyContextType = {
    apiKey,
    setApiKey,
    isApiKeySet: apiKey.length > 0,
    clearApiKey,
  };

  return (
    <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (context === undefined) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
