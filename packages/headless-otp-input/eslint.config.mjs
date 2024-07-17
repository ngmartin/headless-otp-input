import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import { fixupPluginRules } from '@eslint/compat'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['dist/*'] },
  {
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
  },
  {
    plugins: {
      react: eslintPluginReact,
      'react-hooks': fixupPluginRules(eslintPluginReactHooks),
    },
  },
  {
    rules: {
      ...eslintPluginReactHooks.configs.recommended.rules,
    },
  },
  eslintPluginPrettierRecommended,
]
