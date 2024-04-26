module.exports = {
  root: true,
  env: {
    node: true,
  },
  // 配置js全局变量，因为是uni-app，全局的uni是不需要引入的，还有5+的plus对象
  globals: {
    uni: 'readonly',
    plus: 'readonly',
    wx: 'readonly',
    App: 'readonly',
    Page: 'readonly',
  },
  extends: ['plugin:vue/recommended', '@vue/prettier'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 8,
      },
    ],
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['index', 'Global'], //需要忽略的组件名
      },
    ],
    'vue/no-v-model-argument': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  overrides: [
    {
      files: ['**/__tests__/*.spec.{j,t}s?(x)'],
      env: {
        jest: true,
      },
    },
  ],
}
