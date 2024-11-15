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
      to: '/code?d=1',
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
          icon: 'icon-chart',
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
          icon: 'icon-zipFile',
        },
        {
          title: 'Decoder',
          to: '/decoder',
          icon: 'icon-database',
        },
        {
          title: 'Decoder Dynamic',
          to: '/decoder-dynamic',
          icon: 'icon-databaseRepeat',
        },
      ],
    },
    type: 'dropdown',
  },
];
