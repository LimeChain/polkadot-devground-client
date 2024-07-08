import {
  GITHUB_REPO_LINK,
  POLKADOT_GITHUB_LINK,
  POLKADOT_WIKI_LINK,
  X_LINK,
} from './links';

import type { IFooterLinkProps } from '@components/footer/footerLink';

export const footerLinks: IFooterLinkProps[] = [
  {
    linkProps: { to: POLKADOT_GITHUB_LINK, target: '_blank' },
    iconProps: { name: 'icon-github' },
    text: 'Polkadot',
  },
  {
    linkProps: { to: POLKADOT_WIKI_LINK, target: '_blank' },
    iconProps: { name: 'icon-polkadot' },
    text: 'Polkadot Wiki',
  },
  {
    linkProps: { to: GITHUB_REPO_LINK, target: '_blank' },
    iconProps: { name: 'icon-github' },
    className: 'navSpacer ml-5',
    text: 'Limechain',
  },
  {
    linkProps: { to: X_LINK, target: '_blank' },
    iconProps: { name: 'icon-x' },
  },
];