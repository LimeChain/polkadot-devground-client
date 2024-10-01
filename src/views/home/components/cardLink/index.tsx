import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { cn } from '@utils/helpers';

interface CardLinkProps {
  to: string;
  iconName: string;
  title: string;
  description: string;
}

const CardLink: React.FC<CardLinkProps> = ({ to, iconName, title, description }) => {
  return (
    <PDLink
      to={to}
      className={cn(
        'group relative flex flex-1 flex-col p-6 !text-current',
        'border border-transparent hover:border-dev-pink-500',
        'transition-all duration-200 ease-linear',
        'bg-dev-purple-100 dark:bg-dev-black-900',
        'overflow-hidden',
        'after:pointer-events-none after:absolute after:opacity-0 after:content-[""]',
        'after:-right-3/4 after:-top-3/4 after:size-3/4 after:bg-dev-purple-500 after:blur-[150px]',
        'after:transition-opacity after:duration-200',
        'hover:after:opacity-100',
      )}
    >
      <Icon
        name="icon-linkArrow"
        className={cn(
          'absolute right-4 top-4',
          'group-hover:-translate-y-1 group-hover:translate-x-1',
          'transition-transform duration-200 ease-linear',
        )}
      />
      <Icon
        name={iconName}
        className="mb-7 text-dev-pink-500"
        size={[40]}
      />
      <h4 className="mb-2 font-h4-bold">
        {title}
      </h4>
      <p className={cn(
        'font-geist text-dev-black-300 font-body2-regular',
        'dark:text-dev-purple-300',
      )}
      >
        {description}
      </p>
    </PDLink>
  );
};

export default CardLink;
