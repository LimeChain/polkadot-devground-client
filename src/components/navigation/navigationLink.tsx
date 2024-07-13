import {
  type IPDLink,
  PDLink,
} from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

export interface INavigationLink extends IPDLink {
  title: string;
}

export const NavigationLink = ({ title, ...props }: INavigationLink) => {
  return (
    <PDLink
      {...props}
      className={cn(
        'relative px-2 py-5',
        'after:absolute after:bottom-0 after:left-0 after:content-[""]',
        'after:h-[3px] after:w-full after:bg-dev-pink-500',
        'after:opacity-0 after:transition-opacity hover:after:opacity-100',
      )}
    >
      {title}
    </PDLink>
  );
};
