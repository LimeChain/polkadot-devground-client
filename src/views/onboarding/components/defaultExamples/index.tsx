import {
  useCallback,
  useState,
} from 'react';

import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { snippets } from '@constants/snippets';
import { cn } from '@utils/helpers';
import { Search } from '@views/onboarding/components/search';

interface DefaultExamplesProps {
  toggleVisibility: () => void;
}

export const DefaultExamples = (props: DefaultExamplesProps) => {
  const { toggleVisibility } = props;
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
    <div
      className="flex flex-col"
      data-title="Default"
    >
      <Search onChange={handleSearch} />
      <PDScrollArea className="h-[calc(100vh-550px)] grow overflow-y-auto">
        <ul>
          {filteredSnippets.map((snippet, index) => (
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
          ))}
        </ul>
      </PDScrollArea>
      <button
        className={cn('mt-10 p-4 text-center font-body1-regular')}
        onClick={toggleVisibility}
      >
        Have any ideas about Example? Request example here.
      </button>
    </div>
  );
};
