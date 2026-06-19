import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        'intro',
        'getting-started',
        {
            type: 'category',
            label: 'Guide',
            items: ['guide/form-shell', 'guide/fields', 'guide/validation'],
        },
    ],
};

export default sidebars;
