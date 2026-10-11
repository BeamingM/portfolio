"use client";

import { createContext, useContext, ReactNode } from "react";

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: false,
  toggleSound: () => false,
  setSoundEnabled: () => {},
});

export function SoundProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useSound() {
  return useContext(SoundContext);
}
