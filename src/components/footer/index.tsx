import { Icon } from '@components/icon';
import { PDLink } from '@components/ui/PDLink';
import {
  LINK_GITHUB_REPO,
  LINK_LIMECHAIN,
  LINK_X,
} from '@constants/links';
import { cn } from '@utils/helpers';

export const Footer = () => {
  return (
    <footer className={cn(
      'flex items-center justify-between bg-dev-purple-100 dark:bg-dev-black-900',
      'px-6 py-3 lg:px-14 lg:py-5',
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
        <PDLink
          to={LINK_GITHUB_REPO}
          target="_blank"
        >
          <Icon
            name="icon-github"
            size={[24]}
          />
        </PDLink>
        <PDLink
          to={LINK_X}
          target="_blank"
        >
          <Icon
            name="icon-x"
            size={[24]}
          />
        </PDLink>
      </div>
    </footer>
  );
};
