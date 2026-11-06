import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'playwright-report', 'test-results', '.artifacts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, jsxA11y.flatConfigs.recommended],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      // React-Compiler-era rules that are useful for ordinary components...
      'react-hooks/static-components': 'error',
      'react-hooks/set-state-in-render': 'error',
      'react-hooks/error-boundaries': 'error',
      // ...but these flag the core React Three Fiber pattern: mutating Three.js
      // objects and refs inside the frame loop (SPEC §10.2: "Use refs and
      // frame-loop mechanisms for high-frequency animation").
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/purity': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: ['vite.config.ts', 'playwright.config.ts', 'e2e/**/*.ts', 'scripts/**/*.{ts,js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
  },
  {
    // R3F intrinsic elements (<mesh>, <meshStandardMaterial>) carry props that
    // jsx-a11y does not understand; scenes are aria-hidden canvases with DOM
    // equivalents for every interaction.
    files: ['src/scenes/**/*.tsx'],
    rules: {
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
    },
  },
]);
