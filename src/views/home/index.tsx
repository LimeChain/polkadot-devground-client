import FeatureCard from '@components/featureCard';
import { cn } from '@utils/helpers';

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center">
      <h1
        className={cn(
          'pb-4 text-center',
          'text-h3-bold lg:text-h2-bold',
          'before:text-dev-pink-500 before:content-["["]',
          'after:text-dev-pink-500 after:content-["]"]',
        )}
      >
          Empower Your Polkadot Development
      </h1>

      <p className="pb-14 text-center text-body1-regular lg:pb-20 lg:text-h5-regular">
          Elevate your development experience with our next-gen platform for Polkadot developers
      </p>

      <div className="grid w-full max-w-[880px] grid-cols-1 gap-4 md:grid-cols-2">
        <FeatureCard
          icon="icon-github"
          linkProps={
            {
              to: 'https://github.com/LimeChain/polkadot-devground-client',
              target: '_blank',
            }
          }
          title="Code"
          subTitle="Explore our GitHub repository for comprehensive documentation, code examples, and contributions. Join our developer community to enhance your Polkadot projects."
        />
        <FeatureCard
          icon="icon-brackets"
          linkProps={
            {
              to: '/code?s=1',
            }
          }
          title="Developer Console"
          subTitle="Dive into our advanced developer console for seamless on-chain interaction and rapid prototyping. Experience a streamlined, user-friendly environment designed to accelerate your development process and boost productivity."
        />
      </div>
    </section>
  );
};

export default Home;
