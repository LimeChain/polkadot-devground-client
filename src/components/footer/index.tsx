import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { footerLinks } from '@constants/footer';
import { LINK_LIMECHAIN } from '@constants/links';
import { cn } from '@utils/helpers';

import FooterLink from './footerLink';

export const Footer = () => {
  return (
    <footer
      className={cn(
        'flex items-center',
        'justify-center lg:justify-between',
        'flex-col gap-y-4 md:flex-row',
        'bg-dev-purple-100 dark:bg-dev-black-900',
        'px-6 py-3 lg:px-14 lg:py-4',
        'font-geist font-body2-regular',
      )}
    >
      <PDLink
        className="flex items-center gap-2"
        target="_blank"
        to={LINK_LIMECHAIN}
      >
        <span className="font-body2-regular">Made by</span>
        <Icon
          name="logo-limeChain"
          size={[
            94,
            28,
          ]}
        />
      </PDLink>
      <div className="flex items-center gap-5">
        {
          footerLinks.map((link) => {
            return (
              <FooterLink
                key={`footer-link-${link.linkProps.to}`}
                {...link}
              />
            );
          })
        }
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';
