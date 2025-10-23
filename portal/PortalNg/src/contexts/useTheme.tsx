// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// import { useContext } from 'react';
// import { ThemeContextBlock } from './ThemeContextBlock'; // Ensure the path is correct
//
// export const useTheme = () => useContext(ThemeContextBlock);
import { useContext } from 'react';
import { ThemeContextBlock, ThemeContextType } from './ThemeContextBlock';

export const useTheme: () => ThemeContextType = () => useContext(ThemeContextBlock);