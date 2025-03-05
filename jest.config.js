import { pathsToModuleNameMapper } from 'ts-jest';
import fs from 'fs';

const tsConfig = JSON.parse(fs.readFileSync('./tsconfig.json', 'utf-8'));

const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, { prefix: '<rootDir>/' }),
  clearMocks: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  }
};

export default config;
