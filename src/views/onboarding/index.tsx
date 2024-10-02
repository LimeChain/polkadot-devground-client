import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { ModalRequestExample } from '@components/modals/modalRequestExample';
import { PDLink } from '@components/pdLink';
import { Tabs } from '@components/tabs';
import { cn } from '@utils/helpers';
import { DefaultExamples } from '@views/onboarding/components/defaultExamples';
import { GithubExamples } from '@views/onboarding/components/githubExamples';

const Onboarding = () => {
  const [
    RequestExampleModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalRequestExample);

  const refContainer = useRef<HTMLDivElement | null>(null);
  const [
    initialTab,
    setInitialTab,
  ] = useState(0);

  useEffect(() => {
    localStorage.setItem('hasVisitedOnboarding', 'true');
  }, []);

  return (
    <div className="disable-vertical-scroll grid h-screen grid-rows-[auto_1fr] justify-center">
      <h1
        className={cn(
          'pb-4',
          'text-center font-h3-bold',
          'before:text-dev-pink-500 before:content-["["]',
          'after:text-dev-pink-500 after:content-["]"]',
        )}
      >
        Select Example
      </h1>
      <PDLink
        to="/code"
        className={cn(
          'absolute right-20 top-0',
          'mt-1 px-3 py-4',
          'font-geist font-body1-bold',
        )}
      >
        Skip
      </PDLink>
      <Tabs
        initialTab={initialTab}
        onChange={setInitialTab}
        refContainer={refContainer}
        tabClassName="w-full justify-center"
        tabsClassName="mb-10 p-1"
        unmountOnHide={false}
      >
        <div
          className="flex flex-col"
          data-title="Default"
        >
          <DefaultExamples toggleVisibility={toggleVisibility} />
        </div>
        <div
          className="px-16"
          data-title="Custom"
        >
          <GithubExamples />
        </div>
      </Tabs>
      <RequestExampleModal onClose={toggleVisibility} />
    </div>
  );
};

export default Onboarding;
