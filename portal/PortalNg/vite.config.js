// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commonjs from 'vite-plugin-commonjs'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Specify the development server port
    port: 80,
  },
  // Base name of your app
  base: "/coreii-portal", // Replace this with the subdirectory path if needed
});