module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 'off',
    'no-useless-return': 'off',
    'semi-spacing': 'off',
    'object-curly-spacing': 'off',
    'no-trailing-spaces': 'off',
    'key-spacing': 'off',
    'quotes': 'off',
    'comma-dangle': 'off',
    'indent': 'off',
    'keyword-spacing': 'off',
    'eqeqeq': 'off',
    'space-before-blocks': 'off'
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
