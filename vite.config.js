import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  server: {
    hmr: true,
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
  ],
})
