import {
  type IPDLink,
  PDLink,
} from '@components/pdLink';
import { cn } from '@utils/helpers';

export interface INavigationLink extends IPDLink {
  title: string;
  onLinkClick?: () => void;
}

export const NavigationLink = (props: INavigationLink) => {
  const { title, onLinkClick, ...rest } = props;

  return (
    <PDLink
      {...rest}
      onClick={onLinkClick}
      // eslint-disable-next-line react/jsx-no-bind
      className={({ isActive }) => cn(
        'relative p-2',
        'after:absolute after:bottom-0 after:left-0 after:content-[""]',
        'after:h-[3px] after:w-full after:bg-dev-pink-500',
        'after:opacity-0 after:transition-opacity hover:after:opacity-100',
        {
          ['after:opacity-100']: isActive,
        },
      )}
    >
      {title}
    </PDLink>
  );
};
