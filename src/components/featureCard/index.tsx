import { Icon } from '@components/icon';
import { PDLink } from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

import type { LinkProps } from 'react-router-dom';

interface IFeaturesCard {
  linkProps: LinkProps;

  icon?: string;
  title?: string;
  subTitle?: string;

  className?: string;
}

const FeatureCard = ({ icon, linkProps, subTitle, title, className } : IFeaturesCard) => {
  return (
    <PDLink
      className={cn(
        'group',
        'relative',
        'flex flex-1 flex-col',
        'p-6',
        'min-h-[320px]',
        '!text-current',
        'border border-transparent hover:border-dev-pink-500',
        'transition-border-colors duration-200 ease-linear',
        'bg-dev-purple-100 dark:bg-dev-black-900',

        'after:pointer-events-none after:absolute after:opacity-0 after:content-[""]',
        'after:-right-3/4 after:-top-3/4 after:size-3/4 after:bg-dev-purple-500 after:blur-[150px]',
        'after:transition-opacity after:duration-200',
        'hover:after:opacity-100',
        'overflow-hidden',
        className,
      )}
      {...linkProps}
    >
      <Icon
        name="icon-linkArrow"
        size={[24]}
        className={cn(
          'absolute right-4 top-4',
          'transition-transform duration-200 ease-linear',
          'group-hover:-translate-y-1 group-hover:translate-x-1',
        )}
      />
      {
        icon
        && (
          <Icon
            name={icon}
            className="mb-8 text-dev-pink-500"
            size={[40]}
          />
        )
      }
      {
        title
        && (
          <h4 className={cn(
            'text-h4-bold',
            { 'mb-2': subTitle },
          )}
          >{title}
          </h4>
        )
      }
      {
        subTitle
        && (
          <p
            className="font-geist !text-body2-regular text-dev-black-300 dark:text-dev-purple-300"
          >
            {subTitle}
          </p>
        )
      }
    </PDLink>
  );
};

export default FeatureCard;
