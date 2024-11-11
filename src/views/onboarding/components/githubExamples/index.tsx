import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { ExampleNotFound } from '@components/exampleNotFound';
import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';
import { Search } from '@views/onboarding/components/search';
import { useStoreCustomExamples } from 'src/stores/examples';

export const GithubExamples = () => {
  const customExamples = useStoreCustomExamples.use.examples();
  const { getExamples } = useStoreCustomExamples.use.actions();
  const { isGettingExamples } = useStoreCustomExamples.use.loading();

  const [
    filteredSnippets,
    setFilteredSnippets,
  ] = useState(customExamples);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const filtered = customExamples.filter((snippet) =>
      snippet.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredSnippets(filtered);
  }, [customExamples]);

  useEffect(() => {
    setFilteredSnippets(customExamples);
  }, [
    customExamples,
    getExamples,
  ]);

  useEffect(() => {
    getExamples();
  }, [getExamples]);

  if (isGettingExamples) {
    return <Loader />;
  }

  if (!customExamples.length) {
    return <ExampleNotFound />;
  }

  return (
    <>
      <Search onChange={handleSearch} />
      <PDScrollArea className="h-[calc(100vh-550px)] grow overflow-y-auto">
        <ul>
          {filteredSnippets.map((snippet, index) => (
            <li key={index}>
              <PDLink
                to={`/code?c=${snippet.id}`}
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
                  className="rotate-180"
                  name="icon-arrowLeft"
                />
              </PDLink>
            </li>
          ))}
        </ul>
      </PDScrollArea>
    </>
  );
};
