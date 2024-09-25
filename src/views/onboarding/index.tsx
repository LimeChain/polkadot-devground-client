import {
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/pdScrollArea';
import { Tabs } from '@components/tabs';
import { snippets } from '@constants/snippets';
import { useStoreAuth } from '@stores';
import { cn } from '@utils/helpers';

import Search from './components/Search';

const Onboarding = () => {
  const isAuthenticated = useStoreAuth.use.jwtToken?.();
  const { authorize } = useStoreAuth.use.actions();

  const refContainer = useRef<HTMLDivElement | null>(null);
  const [initialTab, setInitialTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSnippets = snippets.filter(snippet =>
    snippet.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="disable-vertical-scroll flex flex-col justify-center px-80">
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
      <Tabs
        refContainer={refContainer}
        initialTab={initialTab}
        onChange={setInitialTab}
        unmountOnHide={false}
        tabClassName="px-2 py-2 mb-10"
      >
        <div
          data-title="Default"
        >
          <Search onChange={e => setSearchQuery(e.target.value)} />
          <PDScrollArea
            className="h-48 w-full"
          >
            <ul>
              {
                filteredSnippets.map((snippet, index) => (
                  <li key={index}>
                    <button
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
                      <Icon
                        name="icon-dropdownArrow"
                        className="-rotate-90"
                      />
                    </button>
                  </li>
                ))
              }
            </ul>
          </PDScrollArea>
        </div>
        <div data-title="Custom">
          {
            isAuthenticated
              ? (
                <p className="text-center font-body1-regular">
                  You have no custom examples.
                </p>
              )
              : (
                <div className="flex flex-col px-24">
                  <Icon
                    name="logo-github"
                    size={[128]}
                    className={cn(
                      'mb-8',
                      'self-center text-dev-white-1000',
                      'dark:text-dev-purple-50',
                    )}
                  />
                  <div className="flex flex-col">
                    <h4 className="mb-4 self-center font-h4-bold">Please Log in</h4>
                    <p className="text-center font-geist">
                      To access your custom examples, please log in using your GitHub account.
                    </p>
                    <button
                      onClick={authorize}
                      className={cn(
                        'mb-2 mt-6 p-4 transition-colors',
                        'font-geist text-white font-body2-bold',
                        'bg-dev-pink-500',
                        'hover:bg-dev-pink-400',
                      )}
                    >
                      Log in
                    </button>
                  </div>
                </div>
              )
          }
        </div>
      </Tabs >

      <p className="mt-10 text-center font-body1-regular">
        Have any ideas about Example? Request example here.
      </p>
    </div>
  );
};

export default Onboarding;
