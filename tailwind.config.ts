import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Courier New', 'monospace', 'ui-monospace']
      }
    },
  },
  plugins: [],
}

export default config
