import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ModalRequestExample } from '@components/modals/modalRequestExample';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { Tabs } from '@components/tabs';
import { snippets } from '@constants/snippets';
import { cn } from '@utils/helpers';

import NotFound from './components/notFound';

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
  const [
    searchQuery,
    setSearchQuery,
  ] = useState('');

  const filteredSnippets = snippets.filter((snippet) =>
    snippet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

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
        to={`/code`}
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
          <Search onChange={handleSearch} />
          <PDScrollArea className="h-[calc(100vh-550px)] grow overflow-y-auto">
            <ul>
              {
                filteredSnippets.map((snippet, index) => (
                  <li key={index}>
                    <PDLink
                      to={`/code?s=${snippet.id}`}
                      className={cn(
                        'flex w-full items-center justify-between',
                        'mt-1 px-3 py-4',
                        'font-geist font-body2-regular',
                        'duration-300 ease-in-out',
                        'hover:bg-dev-purple-100',
                        'dark:hover:bg-dev-purple-900',
                      )}
                    >
                      {snippet.name}
                    </PDLink>
                  </li>
                ))
              }
            </ul>
          </PDScrollArea>
          <button
            onClick={toggleVisibility}
            className={cn(
              'mt-10 p-4 text-center font-body1-regular',
            )}
          >
            Have any ideas about Example? Request example here.
          </button>
        </div>
        <div
          className="px-16"
          data-title="Custom"
        >
          <NotFound />
        </div>
      </Tabs >
      <RequestExampleModal onClose={toggleVisibility} />
    </div>
  );
};

export default Onboarding;
