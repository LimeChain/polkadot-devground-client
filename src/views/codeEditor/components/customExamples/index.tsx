import {
  useCallback,
  useEffect,
} from 'react';

import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';
import { useStoreGists } from 'src/stores/gists';

export const CustomExamples = () => {

  const gists = useStoreGists.use.gists();
  const { getSnippets, loadSnippet } = useStoreGists.use.actions();

  const handleSelectSnippet = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const snippedId = e.currentTarget.getAttribute('data-snippet-index');
    loadSnippet(snippedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSnippets();
  }, [getSnippets]);

  return (
    <PDScrollArea
      verticalScrollClassNames="py-4"
      verticalScrollThumbClassNames="before:bg-dev-purple-700 dark:before:bg-dev-purple-300"
    >
      <ul className="max-h-56 ">
        {
          gists?.length
            ? (
              gists.map((gist, id) => (
                <li key={id}>
                  <button
                    data-snippet-index={gist.id}
                    onClick={handleSelectSnippet}
                    className={cn(
                      'flex w-full items-center justify-between',
                      'px-4 py-3.5',
                      'transition-[background] duration-300',
                      'hover:bg-dev-black-900 hover:dark:bg-dev-purple-200',
                    )}
                  >
                    <p className="font-geist text-dev-white-200 font-body2-regular dark:text-dev-black-1000">
                      {gist.name}
                    </p>
                    <p className="font-geist text-dev-white-1000 font-body3-regular dark:text-dev-black-300">
                      CUSTOM
                    </p>
                  </button>
                </li>
              ))
            )
            : (
              <li className="font-geist text-dev-white-1000 font-body1-regular dark:text-dev-black-300">
                No examples found
              </li>
            )
        }
      </ul>
    </PDScrollArea>
  );
};
