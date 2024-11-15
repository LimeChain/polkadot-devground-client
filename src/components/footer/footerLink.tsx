import {
  Icon,
  type SVGIconProps,
} from '@components/icon';
import {
  type IPDLink,
  PDLink,
} from '@components/pdLink';
import { cn } from '@utils/helpers';

export interface IFooterLinkProps {
  linkProps: IPDLink;
  iconProps: SVGIconProps;
  className?: string;
  text?: string;
}

const FooterLink = ({ linkProps, iconProps, className, text }: IFooterLinkProps) => {
  return (
    <PDLink
      className={cn(
        {
          'px-2 flex items-center gap-[2px]': text,
        },
        className,
      )}
      {...linkProps}
    >
      <Icon
        size={[24]}
        {...iconProps}
      />
      {
        text && (
          <span>{text}</span>
        )
      }
    </PDLink>
  );
};

export default FooterLink;
