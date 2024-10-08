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
  {
    linkProps: {
      title: 'Developer',
      items: [
        {
          title: 'Chain State',
          to: '/chain-state',
          icon: 'icon-chain',
        },
        {
          title: 'Constants',
          to: '/constants',
          icon: 'logo-github',
        },
        {
          title: 'RPC Calls',
          to: '/rpc-calls',
          icon: 'icon-rpcCalls',
        },
        {
          title: 'Runtime Calls',
          to: '/runtime-calls',
          icon: 'icon-runtimeCalls',
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
