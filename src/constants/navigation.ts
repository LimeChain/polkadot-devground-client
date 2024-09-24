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
      title: 'Console',
      to: '/code',
    },
    type: 'link',
  },
  {
    linkProps: {
      title: 'Forks',
      to: '/forks',
    },
    type: 'link',
  },
  {
    linkProps: {
      title: 'Developer',
      items: [
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
      ],
    },
    type: 'dropdown',
  },
];
