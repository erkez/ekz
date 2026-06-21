const recommended = require('@ekz/packer/recommended');
const typescript = require('@ekz/packer/typescript');
const tseslint = require('typescript-eslint');
const globals = require('globals');

module.exports = [
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
            '@typescript-eslint': tseslint.plugin
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': [
                'warn',
                {
                    allowExpressions: true,
                    allowTypedFunctionExpressions: true
                }
            ],
            '@typescript-eslint/no-use-before-define': 'off'
        }
    }
];
