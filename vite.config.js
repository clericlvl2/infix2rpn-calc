import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
  server: {
    hmr: true,
  },
  base: '/rpn-calculator/',
  resolve: {
    alias: {
      '@App': path.resolve(__dirname, './src/App'),
      '@Calculator': path.resolve(__dirname, './src/Calculator'),
      '@lib': path.resolve(__dirname, './src/lib')
    }
  },
  plugins: [
    tailwindcss(),
  ],
})
