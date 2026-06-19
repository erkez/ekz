import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        'intro',
        'getting-started',
        {
            type: 'category',
            label: 'Guide',
            items: ['guide/effects', 'guide/timers', 'guide/storage-and-time'],
        },
    ],
};

export default sidebars;
