import { Link } from 'react-router-dom';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import type { LinkProps } from 'react-router-dom';

interface IFeaturesCard {
  icon: string;
  title:string;
  subTitle:string;

  link: LinkProps['to'];
}

const FeatureCard = ({ icon, link, subTitle, title } : IFeaturesCard) => {
  return (
    <Link className="hover group relative overflow-hidden border border-transparent bg-dev-purple-100 p-6 text-current outline-dev-pink-500  transition-opacity after:pointer-events-none after:absolute after:-right-3/4 after:-top-3/4 after:z-0 after:size-3/4 after:bg-dev-purple-500 after:opacity-0 after:blur-[150px] after:content-[''] hover:border-dev-pink-500 hover:text-current hover:after:opacity-100 dark:bg-dev-black-900 [&>*]:z-10" to={link}>
      <Icon
        name="icon-linkArrow"
        size={[24]}
        className={cn('absolute right-4 top-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1')}
      />
      <Icon
        name={icon}
        className="mb-8 text-dev-pink-500"
        size={[40]}
      />
      {title 
        ? <h4 className={cn('text-h4-bold', { 'mb-2': subTitle })}>{title}</h4>
        : null}
      {subTitle 
        ? <p className="text-body2-regular text-dev-black-300 dark:text-dev-purple-300">{subTitle}</p>
        : null}
    </Link>
  );
};

export default FeatureCard;