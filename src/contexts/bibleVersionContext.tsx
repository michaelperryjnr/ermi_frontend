"use client";

import { createContext, useState, type ReactNode } from "react";

interface BibleVersionContextType {
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
}

export const BibleVersionContext = createContext<BibleVersionContextType>({
  selectedVersion: "kjv",
  setSelectedVersion: () => {},
});

interface BibleVersionProviderProps {
  children: ReactNode;
  initialVersion?: string;
}

export function BibleVersionProvider({
  children,
  initialVersion = "kjv",
}: BibleVersionProviderProps) {
  const [selectedVersion, setSelectedVersion] = useState(initialVersion);

  return (
    <BibleVersionContext.Provider
      value={{ selectedVersion, setSelectedVersion }}
    >
      {children}
    </BibleVersionContext.Provider>
  );
}
