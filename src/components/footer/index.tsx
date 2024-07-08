import { Icon } from '@components/icon';
import { PDLink } from '@components/ui/PDLink';
import {
  LINK_GITHUB_REPO,
  LINK_LIMECHAIN,
  LINK_X,
} from '@constants/links';
import { cn } from '@utils/helpers';

import FooterLink from './footerLink';

export const Footer = () => {
  return (
    <footer className={cn(
      'flex items-center justify-between gap-4 bg-dev-purple-100 dark:bg-dev-black-900',
      'px-6 py-3 lg:px-14 lg:py-4',
      'font-geist text-body2-regular',
      'flex-col-reverse md:flex-row',

    )}
    >
      <PDLink
        to={LINK_LIMECHAIN}
        target="_blank"
        className="flex items-center gap-2"
      >
        <span className="text-body2-regular">Made by</span>
        <Icon
          name="icon-limeChain"
          size={[94, 28]}
        />
      </PDLink>
      <div className="flex items-center gap-5">
        {
          footerLinks.map(link => {
            return (
              <FooterLink key={`footer-link-${link.linkProps.to}`} {...link} />
            )
          })
        }
      </div>
    </footer>
  );
};

export default Footer;
