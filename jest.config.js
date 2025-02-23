const config = {
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest", // Process TypeScript files with ts-jest
  },
};

export default config;
