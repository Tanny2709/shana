"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface DemoModalContextValue {
  open: boolean;
  openDemo: () => void;
  closeDemo: () => void;
}

const DemoModalContext = createContext<DemoModalContextValue | null>(null);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DemoModalContext.Provider value={{ open, openDemo: () => setOpen(true), closeDemo: () => setOpen(false) }}>
      {children}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const ctx = useContext(DemoModalContext);
  if (!ctx) throw new Error("useDemoModal must be used within a DemoModalProvider");
  return ctx;
}
