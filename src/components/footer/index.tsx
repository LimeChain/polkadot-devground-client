import { Icon } from '@components/icon';
import PDLink from '@components/ui/PDLink';
import { footerLinks } from '@constants/footer';
import { LIMECHAIN_LINK } from '@constants/links';
import { cn } from '@utils/helpers';

import FooterLink from './footerLink';

const Footer = () => {
  return (
    <footer className={cn(
      'flex items-center justify-between gap-4 bg-dev-purple-100 dark:bg-dev-black-900',
      'px-6 py-3 lg:px-14 lg:py-4',
      'font-geist text-body2-regular',
      'flex-col-reverse md:flex-row',

    )}
    >
      <PDLink
        to={LIMECHAIN_LINK}
        target="_blank"
        className="flex items-center gap-2"
      >
        <span className="">Made by</span>
        <Icon name="icon-limeChain" size={[94, 28]}/>
      </PDLink>
      <div className="flex items-center gap-5">
        {footerLinks.map(link => <FooterLink key={`footer-link-${link.linkProps.to}`} {...link} />)}
      </div>
    </footer>
  );
};

export default Footer;
