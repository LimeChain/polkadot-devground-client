import FeatureCard from '@components/featureCard';
import { cn } from '@utils/helpers';

const Home = () => {
  return (
    <section className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1
          className={cn(
            'pb-4',
            'text-center text-h3-bold lg:text-h2-bold',
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
            linkProps={
              {
                to: 'https://github.com/LimeChain/polkadot-devground-client',
                target: '_blank',
              }
            }
            icon="icon-github"
            title="Code"
            subTitle="Explore our GitHub repository for comprehensive documentation, code examples, and contributions. Join our developer community to enhance your Polkadot projects."
          />
          <FeatureCard
            linkProps={
              {
                to: '/code?s=1',
              }
            }
            icon="icon-brackets"
            title="Developer Console"
            subTitle="Dive into our advanced developer console for seamless on-chain interaction and rapid prototyping. Experience a streamlined, user-friendly environment designed to accelerate your development process and boost productivity."
          />
        </div>
      </div>
    </section>
  );
};

export default Home;
