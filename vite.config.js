import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
import autoprefixer from "autoprefixer";

export default defineConfig({
  server: {
    hmr: true, // Explicitly enable HMR
  },
  resolve: {
    alias: {
      '@App': path.resolve(__dirname, './src/App'),
      '@Calculator': path.resolve(__dirname, './src/Calculator'),
      '@shared': path.resolve(__dirname, './src/shared')
    }
  },
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
})
