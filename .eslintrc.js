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

module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'eslint:recommended',
  ],

  parser: 'vue-eslint-parser',

  parserOptions: {
    parser: 'babel-eslint',
  },

  plugins: ['vue', 'prettier'],

  // TODO: Add import settings and rules when import order is sorted out
  // settings: {
  //   'import/extensions': allExtensions,
  //   'import/resolver': {
  //     node: {
  //       extensions: allExtensions,
  //       moduleDirectory: ['./node_modules'],
  //     },
  //     webpack: './config/webpack/webpack.config.app.js',
  //     alias: {
  //       map: [['@', './src/']],
  //       extensions: ['.vue', '.js'],
  //     },
  //   },
  // },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'func-names': ['error', 'as-needed'],
    'no-await-in-loop': 'error',
    'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
    'no-param-reassign': ['error', { props: false }],
    'no-bitwise': 'error',
    'no-process-env': 'error',
    'no-magic-numbers': ['error', { ignore: [0] }],
    'prefer-destructuring': 'error',
    'no-multi-assign': 'error',
    'no-underscore-dangle': ['error'],
    camelcase: [
      'error',
      {
        properties: 'always',
      },
    ],
    'max-classes-per-file': ['error'],
    'guard-for-in': 'error',
    'global-require': 'error',
    'consistent-return': 'error',
    'no-use-before-define': 'error',
    'no-restricted-globals': 'error',
    'no-restricted-syntax': 'error',
    'object-curly-newline': 'error',
    'no-unused-vars': 'error',
    curly: ['error', 'multi-line'],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-shadow': 'error',
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
