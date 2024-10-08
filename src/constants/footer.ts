import {
  LINK_GITHUB_REPO,
  LINK_POLKADOT_GITHUB,
  LINK_POLKADOT_WIKI,
  LINK_X,
} from './links';

import type { IFooterLinkProps } from '@components/footer/footerLink';

export const footerLinks: IFooterLinkProps[] = [
  {
    linkProps: {
      to: LINK_POLKADOT_GITHUB,
      target: '_blank',
    },
    iconProps: {
      name: 'logo-github',
    },
    text: 'Polkadot',
    className: 'text-[0] lg:text-sm',
  },
  {
    linkProps: {
      to: LINK_POLKADOT_WIKI,
      target: '_blank',
    },
    iconProps: {
      name: 'logo-polkadot',
    },
    text: 'Polkadot Wiki',
    className: 'text-[0] lg:text-sm',
  },
  {
    linkProps: {
      to: LINK_GITHUB_REPO,
      target: '_blank',
    },
    iconProps: {
      name: 'logo-github',
    },
    className: 'navSpacer ml-5',
    text: 'LimeChain',
  },
  {
    linkProps: {
      to: LINK_X,
      target: '_blank',
    },
    iconProps: {
      name: 'logo-x',
    },
  },
];
