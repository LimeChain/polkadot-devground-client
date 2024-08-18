import { Icon } from '@components/icon';
import { PDLink } from '@components/ui/PDLink';
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

        <div className="grid w-full max-w-[880px] grid-cols-1 gap-4 md:grid-cols-2">
          <PDLink
            target="_blank"
            to="https://github.com/LimeChain/polkadot-devground-client"
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
            )}
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
            <Icon
              name="icon-github"
              className="mb-8 text-dev-pink-500"
              size={[40]}
            />
            <h4 className="mb-2 font-h4-bold">
              Code
            </h4>
            <p className="font-geist text-dev-black-300 font-body2-regular dark:text-dev-purple-300">
              Explore our GitHub repository for comprehensive documentation, code examples, and contributions. Join our developer community to enhance your Polkadot projects.
            </p>
          </PDLink>
          <PDLink
            to="/code?s=1"
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
            )}
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
            <Icon
              name="icon-brackets"
              className="mb-8 text-dev-pink-500"
              size={[40]}
            />
            <h4 className="mb-2 font-h4-bold">
              Developer Console
            </h4>
            <p className="font-geist text-dev-black-300 font-body2-regular dark:text-dev-purple-300">
              Dive into our advanced developer console for seamless on-chain interaction and rapid prototyping. Experience a streamlined, user-friendly environment designed to accelerate your development process and boost productivity.
            </p>
          </PDLink>
        </div>
      </div>
    </section>
  );
};

export default Home;
