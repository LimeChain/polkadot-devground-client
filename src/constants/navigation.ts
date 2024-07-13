import type { TNavItem } from '@components/navigation/navigationItem';

export const NAVIGATION_ITEMS: TNavItem[] = [
  {
    linkProps: {
      title: 'Explore',
      to: '/explorer',
    },
    type: 'link',
  },
  {
    linkProps: {
      title: 'Developer',
      items: [
        {
          title: 'Chain State',
          to: '/explorer',
          icon: 'icon-github',
        },
        {
          title: 'RPC Calls',
          to: '/rpc-calls',
          icon: 'icon-github',
        },
        {
          title: 'Runtime Calls',
          to: '/runtime-calls',
          icon: 'icon-github',
        },
        {
          title: 'Console',
          to: '/code',
          icon: 'icon-github',
        },
      ],
    },
    type: 'dropdown',
  },
];
