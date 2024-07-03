import FeatureCard from '@components/featureCard';
import { GITHUB_REPO_LINK } from '@utils/constants';
import { cn } from '@utils/helpers';

const Home = () => {
  return (
    <section className={cn(
      'flex flex-1 flex-col items-center',
      'lg:pb-[10.75rem] lg:pt-[8rem]',
    )}
    >
      <h1 className={cn(
        'pb-4 text-center text-h3-bold',
        'lg:text-h2-bold',
      )}
      > 
        <span className="hidden pr-2 text-h1-bold text-dev-pink-500 lg:inline">
        [
        </span>
          Empower Your Polkadot Development
        <span className="hidden pl-2 text-h1-bold text-dev-pink-500 lg:inline">
        ]
        </span>
      </h1>
      <p className={cn('pb-14 text-center text-body1-regular lg:pb-20 lg:text-h5-regular')}>Elevate your development experience with our next-gen platform for Polkadot developers</p>

      <div className={cn(
        'grid w-full max-w-[880px] grid-cols-1 gap-4',
        'md:grid-cols-2 [&>*]:md:min-h-[320px]',
      )}
      > 
        <FeatureCard
          icon="icon-github"
          linkProps={
            { to: GITHUB_REPO_LINK,
              target: '_blank', 
            }}
          title="Code"
          subTitle="Explore our GitHub repository for comprehensive documentation, code examples, and contributions. Join our developer community to enhance your Polkadot projects."
        />
        <FeatureCard
          icon="icon-brackets"
          linkProps={{ to: '/code?s=1' }}
          title="Developer Console"
          subTitle="Dive into our advanced developer console for seamless on-chain interaction and rapid prototyping. Experience a streamlined, user-friendly environment designed to accelerate your development process and boost productivity."
        />
      </div>
    </section>
  );
};

export default Home;
