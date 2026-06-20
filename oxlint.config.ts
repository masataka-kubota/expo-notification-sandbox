import { defineConfig } from 'oxlint';
import native from 'oxlint-config-universe/native';

export default defineConfig({
  extends: [native],
  rules: {
    'eslint/no-unused-vars': 'error',
    'eslint/curly': 'warn',

    // TypeScript rules
    'typescript/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'typescript/no-explicit-any': 'warn',

    // --- React rules ---
    'react/exhaustive-deps': 'error',
    'react/rules-of-hooks': 'error',
    'react/jsx-key': 'error',
    'react/no-array-index-key': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
  },
  ignorePatterns: [
    'android/**',
    'ios/**',
    '.expo/**',
    'coverage/**',
    'node_modules/**',
    'dist/**',
  ],
});
