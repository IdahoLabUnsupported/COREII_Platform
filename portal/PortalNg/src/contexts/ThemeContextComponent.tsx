// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { useState } from 'react';
import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct

type Props = {
  children: React.ReactNode;
};

const ThemeContextComponent: React.FC<Props> = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme(currentTheme => currentTheme === 'dark' ? 'light' : 'dark');
  };
  const [isChatOpen, setIsChatOpen] = useState(false); // Chat open/close state
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false); // Drawer collapse state
  return (
    <ThemeContextBlock.Provider value={{ theme, toggleTheme,setIsChatOpen, isChatOpen,isDrawerCollapsed,setIsDrawerCollapsed}}>
      {children}
    </ThemeContextBlock.Provider>
  );
};

export default ThemeContextComponent;
