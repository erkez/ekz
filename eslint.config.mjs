import recommended from '@ekz/packer/recommended';
import typescript from '@ekz/packer/typescript';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';

// An `exports` map does no extension resolution, so an extensionless subpath such as
// `@karlsoft/core/lib/esm/querydsl` stops resolving the moment one is declared.
const noBuildOutputImports = {
    group: ['@karlsoft/*/lib/**', '@ekz/*/lib/**', '@vrnw/*/lib/**'],
    message:
        'Import from the package root — its build output layout is not part of the public surface.'
};

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
    },
    {
        files: ['**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': ['error', { patterns: [noBuildOutputImports] }]
        }
    },
    {
        files: ['modules/karlsoft/ares/**/*.{ts,tsx}', 'modules/vrnw/regio-report/**/*.{ts,tsx}'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        noBuildOutputImports,
                        {
                            group: ['@blueprintjs/*'],
                            message:
                                'Import Blueprint via @karlsoft/core, which re-exports it and replaces Alert, Button, Callout and Card with the enhanced versions.'
                        }
                    ]
                }
            ]
        }
    }
];
