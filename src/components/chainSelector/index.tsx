import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/scrollArea';
import {
  type IChain,
  type ISupportedChains,
  SUPPORTED_CHAINS,
} from '@constants/chains';
import { useStoreChain } from '@stores/chain';
import { cn } from '@utils/helpers';

import type {
  IEventBusSearchChain,
  IEventBusSetChain,
} from '@custom-types/eventBus';

const CHAINS = Object.keys(SUPPORTED_CHAINS);
const ALL_CHAINS = CHAINS.reduce((acc :ISupportedChains['<chain_name>']['chains'], curr) => {
  SUPPORTED_CHAINS[curr].chains.forEach(chain => {
    acc.push(chain);
  });
  return acc;  
}, []);

const ChainSelector = () => {
  const { setChain } = useStoreChain.use.actions();
  
  const [selectedChainGroup, setSelectedChainGroup] = useState('');
  const [filteredChains, setFilteredChains] = useState<ISupportedChains['<chain_name>']['chains']>(ALL_CHAINS);
  const [query, setQuery] = useState('');

  useEventBus<IEventBusSearchChain>('@@-search-chain', ({ data }) => {
    setQuery(data);
  });
  
  const handleSelectGroup = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
    const chain = e.currentTarget.getAttribute('data-chain-group') || '';
    if (chain === selectedChainGroup) {
      setSelectedChainGroup('');
    } else {
      setSelectedChainGroup(chain);
    }
  }, [selectedChainGroup]);
  
  const handleSetChain = useCallback((e:React.MouseEvent<HTMLButtonElement>) => {
    const chain = JSON.parse(e.currentTarget.getAttribute('data-chain-data') || '') as unknown as IChain;

    setChain(chain);
    busDispatch<IEventBusSetChain>({ type: '@@-set-chain', data: chain });
  }, [setChain]);

  const filterChainsByQuery = useCallback((chain:IChain) => {
    return chain.id.toLowerCase().startsWith(query);
  }, [query]);

  useEffect(() => {
    if (selectedChainGroup) {
      setFilteredChains(SUPPORTED_CHAINS[selectedChainGroup].chains.filter(filterChainsByQuery));
    } else {
      setFilteredChains(ALL_CHAINS.filter(filterChainsByQuery));
    }
  }, [selectedChainGroup, filterChainsByQuery]);

  return (
    <div className="grid grid-cols-[276fr_708fr]">
      <PDScrollArea>
        <ul className="bg-dev-purple-100 p-2 dark:bg-dev-black-900">
          {CHAINS.map(chain => (
            <li
              key={`chain-${chain}`}
            >
              <button
                type="button"
                onClick={handleSelectGroup}
                data-chain-group={chain}
                className={cn(
                  'w-full p-4 text-left',
                  'font-geist !text-body2-regular',
                  'transition-colors',
                  ' hover:bg-dev-purple-200 dark:hover:bg-dev-purple-400/20',
                  { 'text-dev-pink-500': chain === selectedChainGroup },
                )}
              >
                {SUPPORTED_CHAINS[chain].name}
              </button>
            </li>
          ),
          )}
        </ul>
      </PDScrollArea>
      <ul className={cn(
        'grid gap-2 p-2 [&>li]:h-[64px]',
        'lg:grid-cols-4',
        'md:grid-cols-2',
        'grid-cols-1',
      )}
      >
        {filteredChains.map(chain => (
          <li
            key={`chain-list-${chain.name}`}
          >
            <button
              onClick={handleSetChain}
              data-chain-data={JSON.stringify(chain)}
              className={cn(
                'flex w-full items-center gap-3 p-4',
                'transition-colors',
                'hover:bg-dev-purple-200 dark:hover:bg-dev-black-800',
              )}
              type="button"
            >
              <Icon
                name={chain.icon}
                size={[28]}
                className="shrink-0"
              />
              <span>
                {chain.name}
              </span>
            </button>
          </li>
        ),
        )}
      </ul>
    </div>
  );
};

export default ChainSelector;