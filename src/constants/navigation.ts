import type { TNavItem } from '@components/navigation/navigationItem';

export const NAVIGATION_ITEMS: TNavItem[] = [
  {
    linkProps: {
      title: 'Explorer',
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
];
