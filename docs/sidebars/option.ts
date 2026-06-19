import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        'intro',
        'getting-started',
        {
            type: 'category',
            label: 'Guide',
            items: ['guide/constructors', 'guide/transformations', 'guide/unwrapping'],
        },
    ],
};

export default sidebars;
