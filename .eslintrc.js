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
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:json/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    'plugin:prettier/recommended',
    'prettier',
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
    'prefer-const': 'error',
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

    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'error',
    'import/no-cycle': 'error',
    'import/order': [
      'error',
      { groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin', 'object'] },
    ],

    // Base Rules (Enabling Correct ESLint Parsing)
    // -------------------------
    'vue/comment-directive': 'error', // plugin:vue/recommended
    'vue/jsx-uses-vars': 'error', // plugin:vue/recommended

    // Priority A: Essential (Error Prevention)
    // -------------------------
    'vue/no-async-in-computed-properties': 'error', // plugin:vue/recommended
    'vue/no-dupe-keys': 'error', // plugin:vue/recommended
    'vue/no-duplicate-attributes': 'error', // plugin:vue/recommended
    'vue/no-parsing-error': 'error', // plugin:vue/recommended
    'vue/no-reserved-keys': 'error', // plugin:vue/recommended
    'vue/no-shared-component-data': 'error', // plugin:vue/recommended fixable
    'vue/no-side-effects-in-computed-properties': 'error', // plugin:vue/recommended
    'vue/no-template-key': 'error', // plugin:vue/recommended
    'vue/no-textarea-mustache': 'error', // plugin:vue/recommended
    'vue/no-unused-components': 'error', // plugin:vue/recommended
    'vue/no-unused-vars': 'error', // plugin:vue/recommended
    'vue/no-use-v-if-with-v-for': 'error', // plugin:vue/recommended
    'vue/require-component-is': 'error', // plugin:vue/recommended
    'vue/require-prop-type-constructor': 'error', // plugin:vue/recommended fixable
    'vue/require-render-return': 'error', // plugin:vue/recommended
    'vue/require-v-for-key': 'error', // plugin:vue/recommended
    'vue/require-valid-default-prop': 'error', // TODO plugin:vue/recommended
    'vue/return-in-computed-property': 'error', // plugin:vue/recommended
    'vue/use-v-on-exact': 'error', // plugin:vue/recommended
    'vue/valid-template-root': 'error', // plugin:vue/recommended
    'vue/valid-v-bind': 'error', // plugin:vue/recommended
    'vue/valid-v-cloak': 'error', // plugin:vue/recommended
    'vue/valid-v-else-if': 'error', // plugin:vue/recommended
    'vue/valid-v-else': 'error', // plugin:vue/recommended
    'vue/valid-v-for': 'error', // plugin:vue/recommended
    'vue/valid-v-html': 'error', // plugin:vue/recommended
    'vue/valid-v-if': 'error', // plugin:vue/recommended
    'vue/valid-v-model': 'error', // plugin:vue/recommended
    'vue/valid-v-on': 'error', // plugin:vue/recommended
    'vue/valid-v-once': 'error', // plugin:vue/recommended
    'vue/valid-v-pre': 'error', // plugin:vue/recommended
    'vue/valid-v-show': 'error', // plugin:vue/recommended
    'vue/valid-v-text': 'error', // plugin:vue/recommended

    // Priority B: Strongly Recommended (Improving Readability)
    // -------------------------
    'vue/attribute-hyphenation': 'error', // plugin:vue/recommended fixable
    'vue/html-closing-bracket-newline': 'error', // plugin:vue/recommended fixable
    'vue/html-closing-bracket-spacing': 'error', // plugin:vue/recommended fixable
    'vue/html-end-tags': 'error', // plugin:vue/recommended fixable
    'vue/html-indent': 'error', // plugin:vue/recommended fixable
    'vue/html-quotes': 'error', // plugin:vue/recommended fixable
    'vue/html-self-closing': 'error', // plugin:vue/recommended fixable
    'vue/max-attributes-per-line': 'error', // plugin:vue/recommended fixable
    'vue/multiline-html-element-content-newline': 'error', // plugin:vue/recommended fixable
    'vue/mustache-interpolation-spacing': 'error', // plugin:vue/recommended fixable
    'vue/name-property-casing': 'error', // plugin:vue/recommended fixable
    'vue/no-multi-spaces': 'error', // plugin:vue/recommended fixable
    'vue/no-spaces-around-equal-signs-in-attribute': 'error', // plugin:vue/recommended fixable
    'vue/no-template-shadow': 'error', // plugin:vue/recommended
    'vue/prop-name-casing': 'error', // plugin:vue/recommended fixable
    'vue/require-default-prop': 'error', // TODO plugin:vue/recommended
    'vue/require-prop-types': 'error', // plugin:vue/recommended
    'vue/singleline-html-element-content-newline': 'error', // plugin:vue/recommended fixable
    'vue/v-bind-style': 'error', // plugin:vue/recommended fixable
    'vue/v-on-style': 'error', // plugin:vue/recommended fixable

    // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)
    // -------------------------
    'vue/attributes-order': 'error', // plugin:vue/recommended fixable
    'vue/no-v-html': 'error', // plugin:vue/recommended
    'vue/order-in-components': 'error', // plugin:vue/recommended fixable
    'vue/this-in-template': 'error', // plugin:vue/recommended

    // Uncategorized
    // -------------------------
    'vue/custom-event-name-casing': 'error',
    'vue/array-bracket-spacing': 'error', // fixable
    'vue/arrow-spacing': 'error', // fixable
    'vue/block-spacing': 'error', // fixable
    'vue/brace-style': 'error', // fixable
    'vue/camelcase': 'error',
    'vue/comma-dangle': 'error', // fixable
    'vue/component-name-in-template-casing': 'error', // fixable
    'vue/dot-location': 'error', // fixable
    'vue/eqeqeq': 'error', // fixable
    'vue/key-spacing': 'error', // fixable
    'vue/keyword-spacing': 'error', // fixable
    'vue/match-component-file-name': 'error',
    'vue/no-boolean-default': ['error', 'default-false'],
    'vue/no-deprecated-scope-attribute': 'error', // fixable
    'vue/no-empty-pattern': 'error',
    'vue/no-restricted-syntax': 'error',
    'vue/object-curly-spacing': 'error', // fixable
    'vue/require-direct-export': 'off', // Doesn't work with Composition APIs defineComponent
    indent: 'off', //note you must disable the base rule as it can report incorrect errors when used with TS
    'vue/script-indent': 'off', // off since it needs to use @typescript-eslint/indent for TS code: https://eslint.vuejs.org/rules/script-indent.html
    '@typescript-eslint/indent': 'off', // off since we have prettier for indent and this: https://github.com/typescript-eslint/typescript-eslint/issues/1824
    'vue/space-infix-ops': 'error', // fixable
    'vue/space-unary-ops': 'error', // fixable
    'vue/v-on-function-call': 'error', // fixable
    'vue/v-slot-style': 'error', // fixable
    'vue/valid-v-slot': 'error',
  },
};
