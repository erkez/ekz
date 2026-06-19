import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
    docs: [
        'intro',
        'getting-started',
        {
            type: 'category',
            label: 'Guide',
            items: ['guide/http-client', 'guide/websockets', 'guide/errors-and-queue'],
        },
    ],
};

export default sidebars;
