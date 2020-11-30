/**
 * ten9, Inc
 * Copyright (c) 2015 - 2020 ten9, Inc
 * -----
 * NOTICE:  All information contained herein is, and remains
 * the property of ten9 Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to ten9 Incorporated
 * and its suppliers and may be covered by U.S. and Foreign Patents,
 * patents in process, and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from ten9 Incorporated.
 * -----
 */

const jsExtensions = ['.vue', '.js', '.jsx'];
const tsExtensions = ['.ts', '.tsx'];
const allExtensions = jsExtensions.concat(tsExtensions);

module.exports = {
  root: true,

  env: {
    es6: true,
    node: true,
  },

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended', // Disable rules that are incompatible with or better handled by TypeScript
    'plugin:@typescript-eslint/recommended', // The intention is that you can use all the configs together, as they build upon one-another:
    'plugin:@typescript-eslint/recommended-requiring-type-checking', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'plugin:json/recommended',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier',
    'prettier/standard',
    'prettier/@typescript-eslint',
    'prettier/vue',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 2018,
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },

  plugins: ['pug', 'vue', 'prettier', '@typescript-eslint'],

  // TODO: Add import settings and rules when import order is sorted out
  settings: {
    'import/extensions': allExtensions,
    'import/resolver': {
      node: {
        extensions: allExtensions,
        moduleDirectory: ['./node_modules'],
      },
      webpack: './config/webpack/webpack.config.js',
      alias: {
        map: [['@', './src/']],
        extensions: allExtensions,
      },
    },
    'import/parsers': { '@typescript-eslint/parser': tsExtensions },
  },

  rules: {
    // eslint-disable-next-line no-process-env
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // eslint-disable-next-line no-process-env
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'func-names': ['error', 'as-needed'],
    'no-await-in-loop': 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-bitwise': 'error',
    'no-process-env': 'error',
    'no-magic-numbers': 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/no-magic-numbers': [
      'warn',
      {
        ignore: [0, 1, 2],
        ignoreArrayIndexes: true,
        ignoreNumericLiteralTypes: true,
        ignoreEnums: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    'prefer-destructuring': 'error',
    'no-multi-assign': 'error',
    'no-underscore-dangle': ['error'],
    'max-classes-per-file': ['error'],
    'guard-for-in': 'error',
    'global-require': 'error',
    'consistent-return': 'error',
    'no-use-before-define': 'error',
    'no-restricted-globals': 'error',
    'no-restricted-syntax': 'error',
    'object-curly-newline': 'error',

    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
    'no-unused-vars': 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
      },
    ],
    curly: ['error', 'multi-line'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-shadow': 'off', // note you must disable the base rule as it can report incorrect errors
    '@typescript-eslint/no-shadow': [
      'error',
      { allow: ['req', 'res', 'err'], ignoreFunctionTypeParameterNameValueShadow: true },
    ],
    'no-var': ['error'],
    'class-methods-use-this': ['error'],
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'prefer-arrow-callback': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    '@typescript-eslint/ban-ts-comment': 'error',
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: true,
      },
    ],
    camelcase: [
      'error',
      {
        properties: 'always',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always', // prettier requires it
        },
      },
    ],
    // TODO: Turning this off for now. Need to revisit to enforce
    // 1 attribute per line AND have prettier work.
    'vue/max-attributes-per-line': 'off',

    // TODO: Add import rules when import order is sorted out
    // 'import/no-unresolved': 'error',
    // 'import/prefer-default-export': 'error',
    // 'import/no-cycle': 'error',
    // 'import/order': [
    //   'error',
    //   { groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object'] },
    // ],
    // 'import/extensions': [
    //   'error',
    //   'ignorePackages',
    //   {
    //     js: 'never',
    //     jsx: 'never',
    //     ts: 'always',
    //     tsx: 'always',
    //   },
    // ],
  },
};
