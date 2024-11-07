import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { ModalSendMail } from '@components/modals/modalSendMail';
import { PDLink } from '@components/pdLink';
import { Tabs } from '@components/tabs';
import { cn } from '@utils/helpers';
import { DefaultExamples } from '@views/onboarding/components/defaultExamples';
import { GithubExamples } from '@views/onboarding/components/githubExamples';

const Onboarding = () => {
  const [
    SendMailModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalSendMail);

  const refContainer = useRef<HTMLDivElement | null>(null);
  const [
    initialTab,
    setInitialTab,
  ] = useState(0);

  useEffect(() => {
    localStorage.setItem('hasVisitedOnboarding', 'true');
  }, []);

  return (
    <div className="disable-vertical-scroll m-auto grid w-1/2 grid-rows-[auto_1fr]">
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
          'cursor-pointer',
          'absolute right-20 top-0',
          'mt-1 px-3 py-4',
          'font-geist font-body1-bold',
          'duration-200 hover:text-dev-pink-500',
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
        <div data-title="Default">
          <DefaultExamples toggleVisibility={toggleVisibility} />
        </div>
        <div data-title="Custom">
          <GithubExamples />
        </div>
      </Tabs>
      <SendMailModal
        onClose={toggleVisibility}
        title="Request Example"
      />
    </div>
  );
};

export default Onboarding;
