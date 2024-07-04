import { Icon } from '@components/icon';
import PDLink from '@components/ui/PDLink';
import { cn } from '@utils/helpers';

import type { LinkProps } from 'react-router-dom';

interface IFeaturesCard {
  linkProps: LinkProps;

  icon?: string;
  title?:string;
  subTitle?:string;

  className?:string;
}

const FeatureCard = ({ icon, linkProps, subTitle, title, className } : IFeaturesCard) => {
  return (
    <PDLink 
      className={cn(
        'group', 
        'relative overflow-hidden border border-transparent p-6 text-current hover:text-current',
        'hover:border-dev-pink-500',
        'flex flex-col',
        'transition-[border-color] duration-200 ease-linear',
        'bg-dev-purple-100 dark:bg-dev-black-900',

        'after:pointer-events-none after:absolute after:z-0 after:opacity-0 after:content-[""]',
        'after:-right-3/4 after:-top-3/4 after:size-3/4 after:bg-dev-purple-500 after:blur-[150px]',
        'after:transition-opacity after:duration-200',
        'hover:after:opacity-100',
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
      {icon 
        ? (
          <Icon
            name={icon}
            className="mb-8 text-dev-pink-500"
            size={[40]}
          />
        )
        : null}
      {title 
        ? <h4 className={cn('text-h4-bold', { 'mb-2': subTitle })}>{title}</h4>
        : null}
      {subTitle 
        ? <p className="font-geist text-body2-regular text-dev-black-300 dark:text-dev-purple-300">{subTitle}</p>
        : null}
    </PDLink>
  );
};

export default FeatureCard;