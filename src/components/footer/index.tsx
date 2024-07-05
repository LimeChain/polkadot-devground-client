import {
  GITHUB_REPO_LINK,
  LIMECHAIN_LINK,
  X_LINK,
} from '@constants/links';

import { Icon } from '@components/icon';
import PDLink from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

const Footer = () => {
  return (
    <footer className={cn(
      'flex items-center justify-between bg-dev-purple-100 dark:bg-dev-black-900',
      'px-6 py-3 lg:px-14 lg:py-5',
    )}
    >
      <PDLink
        to={LIMECHAIN_LINK}
        target="_blank"
        className="flex items-center gap-2"
      >
        <span className="text-body2-regular">Made by</span>
        <Icon name="icon-limeChain" size={[94, 28]}/>
      </PDLink>
      <div className="flex items-center gap-5">
        <PDLink to={GITHUB_REPO_LINK} target="_blank">
          <Icon name="icon-github" size={[24]}/>
        </PDLink>
        <PDLink
          to={X_LINK}
          target="_blank"
        >
          <Icon name="icon-x" size={[24]}/>
        </PDLink>
      </div>
    </footer>
  );
};

export default Footer;