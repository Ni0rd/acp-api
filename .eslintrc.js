module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },  
  plugins: [
    'eslint-plugin',
    '@typescript-eslint',    
    'jest',
    'import',
    'eslint-comments',
    'prettier'
  ],
  extends: [
    'airbnb-typescript/base',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier/@typescript-eslint',
    'prettier'
  ],
  env: {
    node: true,
    es6: true,
    'jest/globals': true,
  },  
  'rules': {
    'prettier/prettier': 2,
    'import/prefer-default-export': 'off',
  }
};
