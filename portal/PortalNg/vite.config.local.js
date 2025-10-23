// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Specify the development server port
    port: 5173,
  },
  // Base name of your app
  base: "/",
});