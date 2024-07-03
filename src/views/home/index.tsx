import FeatureCard from '@components/featureCard';
import { cn } from '@utils/helpers';

const Home = () => {
  return (
    <section className={cn('flex flex-1 flex-col items-center pb-[10.75rem] pt-[8rem]')}>
      <h1 className={cn('pb-4 text-center text-h2-bold')}> 
        <span className="pr-2 text-h1-bold text-dev-pink-500">
        [
        </span>
          Empower Your Polkadot Development
        <span className="pl-2 text-h1-bold text-dev-pink-500">
        ]
        </span>
      </h1>
      <p className={cn('pb-20 text-center text-h5-regular')}>Elevate your development experience with our next-gen platform for Polkadot developers</p>

      <div className={cn('grid w-full max-w-[880px] grid-cols-2 gap-4 [&>*]:min-h-[320px]')} > 
        <FeatureCard
          icon="icon-github"
          link={'https://github.com/LimeChain/polkadot-devground-client'}
          title="Code"
          subTitle="Explore our GitHub repository for comprehensive documentation, code examples, and contributions. Join our developer community to enhance your Polkadot projects."
        />
        <FeatureCard
          icon="icon-brackets"
          link={'/code?s=1'}
          title="Developer Console"
          subTitle="Dive into our advanced developer console for seamless on-chain interaction and rapid prototyping. Experience a streamlined, user-friendly environment designed to accelerate your development process and boost productivity."
        />
      </div>
    </section>
  );
};

export default Home;
