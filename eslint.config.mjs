import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['**/eslint.config.mjs', 'mobile/', 'node_modules/', 'dist/', 'backups/', '*.db', '*.db-wal', '*.db-shm'] },
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.mocha },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
  {
    files: ['public/sw.js'],
    languageOptions: {
      globals: { self: 'writable', caches: 'readable' },
    },
  },
];
