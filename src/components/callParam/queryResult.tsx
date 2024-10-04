import {
  useEffect,
  useState,
} from 'react';
import 'react18-json-view/src/dark.css';
import 'react18-json-view/src/style.css';
import JsonView from 'react18-json-view';

import { Icon } from '@components/icon';
import { Loader } from '@components/loader';
import { useStoreUI } from '@stores';
import {
  cn,
  sleep,
} from '@utils/helpers';
import { unwrapApiResult } from '@utils/papi/helpers';

interface IQueryResult {
  title: string;
  path: string;
  result?: unknown;
  isLoading?: boolean;
  onRemove?: () => void;
}

export const QueryResult = ({
  title,
  path,
  result,
  isLoading,
  onRemove,
}: IQueryResult) => {

  const [
    resultIsLoading,
    setResultIsLoading,
  ] = useState(true);

  const theme = useStoreUI?.use?.theme?.();

  useEffect(() => {
    void (async () => {
      // used to prevent a flickering feel when the result loads too quickly
      await sleep(500);
      setResultIsLoading(!!isLoading);
    })();
  }, [isLoading]);

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-6 font-geist font-body2-regular',
        'bg-dev-purple-200 dark:bg-dev-black-800',
      )}
    >
      <div className="flex justify-between gap-4">
        <p className="font-body1-bold">
          {title}
        </p>

        <button
          onClick={onRemove}
          type="button"
        >
          <Icon
            name="icon-close"
            size={[24]}
          />
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <p>
          Path:
          {' '}
          {' '}
          <span
            className={cn(
              'rounded-md px-1 py-[2px] dark:bg-dev-black-600',
              'bg-dev-purple-400/20 dark:bg-dev-black-600',
            )}
          >
            {path}
          </span>
        </p>

        <div
          className={cn(
            'relative flex flex-col gap-2',
            {
              ['h-18']: resultIsLoading,
            },
          )}
        >
          {
            resultIsLoading
              ? <Loader classNames="!top-3/4" />
              : (
                <>
                  Result
                  <JsonView
                    collapseObjectsAfterLength={8}
                    src={unwrapApiResult(result)}
                    theme="atom"
                    style={{
                      borderRadius: 8,
                      backgroundColor: theme === 'dark' ? '#252525' : '#FBFCFE',
                      padding: 16,
                    }}
                    enableClipboard
                  />
                </>
              )
          }
        </div>
      </div>
    </div>
  );
};
