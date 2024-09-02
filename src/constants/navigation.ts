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
          icon: 'icon-github',
        },
        {
          title: 'Chain State',
          to: '/chain-state',
          icon: 'icon-github',
        },
        {
          title: 'Extrinsics',
          to: '/extrinsics',
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
