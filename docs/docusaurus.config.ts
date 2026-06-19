import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

import { ekzDocPackages } from './packages';

// Public mirror layout: modules/ekz/docs/ → docs/ at repo root. Docusaurus appends content/<pkg>/…
const docsEditUrl = 'https://github.com/erkez/ekz/edit/main/docs/';

const docPlugins = ekzDocPackages.map(
    (pkg) =>
        [
            '@docusaurus/plugin-content-docs',
            {
                id: pkg.id,
                path: `content/${pkg.id}`,
                routeBasePath: pkg.routeBasePath,
                sidebarPath: `./sidebars/${pkg.id}.ts`,
                editUrl: docsEditUrl,
            },
        ] as const,
);

const config: Config = {
    title: '@ekz',
    tagline: 'Documentation for @ekz npm packages',
    favicon: 'img/favicon.svg',

    url: 'https://docs.ekz.io',
    baseUrl: '/',

    organizationName: 'erkez',
    projectName: 'ekz',

    onBrokenLinks: 'throw',

    markdown: {
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },

    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    presets: [
        [
            'classic',
            {
                docs: false,
                blog: false,
                theme: {
                    customCss: './src/css/custom.css',
                },
            } satisfies Preset.Options,
        ],
    ],

    plugins: [...docPlugins],

    themeConfig: {
        navbar: {
            title: '@ekz docs',
            items: [
                {
                    to: '/',
                    label: 'Home',
                    position: 'left',
                },
                {
                    type: 'dropdown',
                    label: 'Packages',
                    position: 'left',
                    items: ekzDocPackages.map((pkg) => ({
                        type: 'docSidebar' as const,
                        docsPluginId: pkg.id,
                        sidebarId: 'docs',
                        label: pkg.npm,
                    })),
                },
                {
                    href: 'https://github.com/erkez/ekz',
                    label: 'GitHub',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Packages',
                    items: ekzDocPackages.map((pkg) => ({
                        label: pkg.npm,
                        to: `/${pkg.routeBasePath}/`,
                    })),
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'npm org',
                            href: 'https://www.npmjs.com/org/ekz',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/erkez/ekz',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} @ekz contributors. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['tsx', 'typescript'],
        },
    } satisfies Preset.ThemeConfig,
};

export default config;
