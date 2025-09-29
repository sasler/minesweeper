import path from 'node:path';
import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import pluginHtml from 'eslint-plugin-html';
import pluginN from 'eslint-plugin-n';
import globals from 'globals';

const importRules = pluginImport.configs.recommended.rules;
const jestRules = pluginJest.configs['flat/recommended'].rules;
const nodeRules = pluginN.configs['flat/recommended'].rules;
const aliasMap = [
  ['@scripts', path.resolve('src/scripts')],
  ['@core', path.resolve('src/scripts/core')],
  ['@state', path.resolve('src/scripts/state')],
  ['@ui', path.resolve('src/scripts/ui')]
];

export default [
  {
    ignores: ['dist/**', 'coverage/**', 'playwright-report/**', 'node_modules/**', '.lighthouse/**']
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      import: pluginImport,
      jest: pluginJest,
      html: pluginHtml,
      n: pluginN
    },
    settings: {
      'import/resolver': {
        alias: {
          map: aliasMap,
          extensions: ['.js'],
          cwd: path.resolve('.')
        },
        node: {
          extensions: ['.js'],
          paths: [path.resolve('src')]
        }
      },
      'import/core-modules': ['@axe-core/playwright'],
      'import/internal-regex': '^@'
    },
    rules: {
      ...importRules,
      ...nodeRules,
      'import/order': 'off',
      'n/no-missing-import': [
        'error',
        {
          tryExtensions: ['.js']
        }
      ],
      'n/no-unpublished-import': 'off',
      'n/no-unsupported-features/es-builtins': 'off',
      'n/no-unsupported-features/node-builtins': 'off'
    }
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    },
    plugins: {
      jest: pluginJest
    },
    rules: {
      ...jestRules
    }
  },
  {
    files: ['src/**/*.html'],
    plugins: {
      html: pluginHtml
    }
  }
];
