import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/scrollArea';
import { SUPPORTED_CHAINS } from '@utils/constants';
import { cn } from '@utils/helpers';

const CHAINS = Object.keys(SUPPORTED_CHAINS);

const ChainSelector = () => {
  return (
    <div className="grid grid-cols-[276fr_708fr]">
      <PDScrollArea>
        <ul className="bg-dev-purple-100 p-2  dark:bg-dev-black-900">
          {CHAINS.map(chain => (
            <li
              key={`chain-${chain}`}
            >
              <button
                type="button"
                className={cn(
                  'w-full p-4 text-left',
                  'font-geist text-body2-regular',
                  'transition-colors',
                  ' hover:bg-dev-purple-200 dark:hover:bg-dev-purple-400/20',
                )}
              >
                {SUPPORTED_CHAINS[chain].name}
              </button>
            </li>
          ),
          )}
        </ul>
      </PDScrollArea>
      <ul className="grid grid-cols-4 gap-2 p-2 [&>li]:h-[64px]">
        {CHAINS.map(
          chain => SUPPORTED_CHAINS[chain].chains.map(chain => (
            <li
              key={`chain-list-${chain.name}`}
            >
              <button
                className={cn(
                  'flex w-full items-center gap-3 p-4',
                  'transition-colors',
                  'hover:bg-dev-purple-200 dark:hover:bg-dev-black-800',
                )}
                type="button"
              >
                <Icon name={chain.icon} size={[28]}/>
                <span>
                  {chain.name}
                </span>
              </button>
            </li>
          ),
          ))}
      </ul>
    </div>
  );
};

export default ChainSelector;