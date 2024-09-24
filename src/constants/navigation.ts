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
          title: 'Explorer',
          to: '/explorer',
          icon: 'logo-github',
        },
        {
          title: 'Chain State',
          to: '/chain-state',
          icon: 'logo-github',
        },
        {
          title: 'Constants',
          to: '/constants',
          icon: 'logo-github',
        },
        {
          title: 'Runtime Calls',
          to: '/runtime-calls',
          icon: 'logo-github',
        },
        {
          title: 'Extrinsics',
          to: '/extrinsics',
          icon: 'logo-github',
        },
        {
          title: 'Rpc Calls',
          to: '/rpc-calls',
          icon: 'logo-github',
        },
        {
          title: 'Console',
          to: '/code',
          icon: 'logo-github',
        },
      ],
    },
    type: 'dropdown',
  },
];
