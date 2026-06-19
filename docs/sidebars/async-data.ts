import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        'intro',
        'getting-started',
        {
            type: 'category',
            label: 'Guide',
            items: ['guide/states', 'guide/promises', 'guide/extractors'],
        },
    ],
};

export default sidebars;
