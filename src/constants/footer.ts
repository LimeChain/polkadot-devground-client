import {
  LINK_GITHUB_REPO,
  LINK_POLKADOT_GITHUB,
  LINK_POLKADOT_WIKI,
  LINK_X,
} from './links';

import type { IFooterLinkProps } from '@components/footer/footerLink';

export const footerLinks: IFooterLinkProps[] = [
  {
    linkProps: { to: LINK_POLKADOT_GITHUB, target: '_blank' },
    iconProps: { name: 'icon-github' },
    text: 'Polkadot',
  },
  {
    linkProps: { to: LINK_POLKADOT_WIKI, target: '_blank' },
    iconProps: { name: 'icon-polkadot' },
    text: 'Polkadot Wiki',
  },
  {
    linkProps: { to: LINK_GITHUB_REPO, target: '_blank' },
    iconProps: { name: 'icon-github' },
    className: 'navSpacer ml-5',
    text: 'Limechain',
  },
  {
    linkProps: { to: LINK_X, target: '_blank' },
    iconProps: { name: 'icon-x' },
  },
];
