import recommended from '@ekz/packer/recommended';
import typescript from '@ekz/packer/typescript';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

export default [
    {
        ignores: ['**/lib/**', '**/dist/**', '**/node_modules/**']
    },
    ...recommended,
    ...typescript,
    {
        languageOptions: {
            globals: {
                ...globals.jest
            }
        },
        rules: {
            'react-hooks/exhaustive-deps': [
                'warn',
                {
                    additionalHooks: '(^useAsyncData$)'
                }
            ]
        }
    },
    {
        files: ['**/*.{ts,tsx}'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
            '@stylistic': stylistic
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true
                }
            ],
            '@typescript-eslint/no-use-before-define': 'off',
            '@stylistic/padding-line-between-statements': [
                'warn',
                { blankLine: 'always', prev: '*', next: ['function', 'class', 'type', 'interface'] },
                { blankLine: 'always', prev: ['function', 'class', 'type', 'interface'], next: '*' },
                { blankLine: 'always', prev: '*', next: ['if', 'for', 'while', 'try'] },
                { blankLine: 'always', prev: ['if', 'for', 'while', 'try'], next: '*' }
            ]
        }
    }
];
