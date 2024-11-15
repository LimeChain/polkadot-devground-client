import {
  useCallback,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { snippets } from '@constants/snippets';
import { cn } from '@utils/helpers';
import { Search } from '@views/onboarding/components/search';

export const DefaultExamples = () => {
  const [
    filteredSnippets,
    setFilteredSnippets,
  ] = useState(snippets);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    const filtered = snippets.filter((snippet) =>
      snippet.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredSnippets(filtered);
  }, []);

  return (
    <>
      <Search onChange={handleSearch} />
      <PDScrollArea className="h-[calc(100vh-550px)] overflow-y-auto">
        <ul>
          {filteredSnippets.map((snippet, index) => (
            <li key={index}>
              <PDLink
                to={`/code?d=${snippet.id}`}
                className={cn(
                  'flex items-center justify-between',
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
