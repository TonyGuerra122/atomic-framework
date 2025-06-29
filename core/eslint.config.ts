import tseslint from 'typescript-eslint';
import parser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

const baseConfig = tseslint.config({
  files: ['**/*.ts'],
  languageOptions: {
    parser,
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: {
    '@typescript-eslint': tsPlugin as any,
    prettier: prettierPlugin,
    import: importPlugin as any,
    'unused-imports': unusedImportsPlugin as any,
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        'newlines-between': 'always',
      },
    ],
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
});

const config: FlatConfig.Config[] = baseConfig.map((c) => ({
  ...c,
  files: (c.files ?? []).flat() as string[],
}));

export default config;
