module.exports = {
  env: {
    browser: true,
    es2022: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'autofix'],
  rules: {
    'autofix/prefer-spread': 'error'
  }
}