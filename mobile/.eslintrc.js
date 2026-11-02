module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: ['jest.setup.js', 'vendor/**', 'coverage/**'],
  rules: {
    // Fire-and-forget async handlers in screens (bootstrap, loaders, navigation).
    'no-void': 'off',
  },
  overrides: [
    {
      files: ['**/__tests__/**/*.{js,ts,tsx}', '**/*.{test,spec}.{js,ts,tsx}'],
      env: {
        jest: true,
      },
    },
  ],
};
