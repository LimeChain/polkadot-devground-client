import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type React from 'react';

interface IFeaturesCard {
  children:React.ReactNode;

  icon?: string;
  className?:string;
}

const FeatureCard = ({ className, children, icon = 'icon-linkArrow' } : IFeaturesCard) => {
  return (
    <div 
      className={cn(
        'group', 
        'relative overflow-hidden border border-transparent p-6 text-current hover:text-current',
        'hover:border-dev-pink-500',
        'transition-[border-color] duration-200 ease-linear',
        'bg-dev-purple-100 dark:bg-dev-black-900',

        'after:pointer-events-none after:absolute after:z-0 after:opacity-0 after:content-[""]',
        'after:-right-3/4 after:-top-3/4 after:size-3/4 after:bg-dev-purple-500 after:blur-[150px]',
        'after:transition-opacity after:duration-200',
        'hover:after:opacity-100',
        className,
      )}
    >
      <Icon
        name={icon}
        size={[24]}
        className={cn(
          'absolute right-4 top-4', 
          'transition-transform duration-200 ease-linear',
          'group-hover:-translate-y-1 group-hover:translate-x-1',
        )}
      />
      {children}
    </div>
  );
};

export default FeatureCard;