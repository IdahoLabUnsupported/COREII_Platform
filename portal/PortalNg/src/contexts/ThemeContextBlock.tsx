// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { createContext, useState } from 'react';

export interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (value: boolean) => void;
  isDrawerCollapsed: boolean;
  setIsDrawerCollapsed: (value: boolean) => void;
}

export const ThemeContextBlock = createContext<ThemeContextType>({
  theme: 'dark',
  toggleTheme: () => { console.warn('toggleTheme was called without a ThemeContext.Provider'); },
  isChatOpen: false,
  setIsChatOpen: () => {},
  isDrawerCollapsed: false,
  setIsDrawerCollapsed: () => {},
});
