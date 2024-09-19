import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { HOME_LINKS } from '@constants/homeLinks';
import { cn } from '@utils/helpers';

const Home = () => {
  return (
    <section className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1
          className={cn(
            'pb-4',
            'text-center font-h3-bold lg:font-h2-bold',
            'before:text-dev-pink-500 before:content-["["]',
            'after:text-dev-pink-500 after:content-["]"]',
          )}
        >
          Empower Your Polkadot Development
        </h1>

        <p className="pb-14 text-center font-body1-regular lg:pb-20 lg:font-h5-regular">
          Elevate your development experience with our next-gen platform for Polkadot developers
        </p>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {HOME_LINKS.map((card) => (
            <PDLink
              key={card.to}
              to={card.to}
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
                size={[24]}
                className="absolute right-4 top-4 transition-transform duration-200 ease-linear group-hover:-translate-y-1 group-hover:translate-x-1"
              />
              <Icon
                name={card.iconName}
                className="mb-7 text-dev-pink-500"
                size={[40]}
              />
              <h4 className="mb-2 font-h4-bold">
                {card.title}
              </h4>
              <p className="font-geist text-dev-black-300 font-body2-regular dark:text-dev-purple-300">
                {card.description}
              </p>
            </PDLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
