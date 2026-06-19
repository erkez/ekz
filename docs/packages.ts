export type EkzDocPackage = {
    id: string;
    routeBasePath: string;
    label: string;
    npm: string;
    description: string;
    accent: string;
};

export const ekzDocPackages: EkzDocPackage[] = [
    {
        id: 'api',
        routeBasePath: 'api',
        label: 'API',
        npm: '@ekz/api',
        description: 'HTTP and WebSocket client',
        accent: '#ea580c',
    },
    {
        id: 'async-data',
        routeBasePath: 'async-data',
        label: 'Async Data',
        npm: '@ekz/async-data',
        description: 'Async state for promises',
        accent: '#0d9488',
    },
    {
        id: 'formix',
        routeBasePath: 'formix',
        label: 'Formix',
        npm: '@ekz/formix',
        description: 'Type-safe React forms',
        accent: '#2f6feb',
    },
    {
        id: 'option',
        routeBasePath: 'option',
        label: 'Option',
        npm: '@ekz/option',
        description: 'Option/Maybe type',
        accent: '#7c3aed',
    },
    {
        id: 'react-utils',
        routeBasePath: 'react-utils',
        label: 'React Utils',
        npm: '@ekz/react-utils',
        description: 'React hooks and utilities',
        accent: '#0284c7',
    },
];
