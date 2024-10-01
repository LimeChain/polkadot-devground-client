import { HOME_LINKS } from '@constants/links';
import { cn } from '@utils/helpers';

import CardLink from './components/cardLink';

const Home = () => {
  const hasVisited = localStorage.getItem('hasVisitedOnboarding');

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

        <p className={cn(
          'pb-14',
          'text-center font-body1-regular',
          'lg:font-h5-regular" lg:pb-20',
        )}
        >
          Elevate your development experience with our next-gen platform for Polkadot developers
        </p>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <CardLink
            description={'With devGround’s custom IDE, safely execute selected JavaScript snippets within the ecosystem.'}
            iconName="icon-brackets"
            title="Developer Console"
            to={hasVisited ? '/code' : '/onboarding'}
          />
          {HOME_LINKS.map((card) => (
            <CardLink
              key={card.to}
              {...card}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
