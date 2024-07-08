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
import { SUPPORTED_CHAINS } from '@constants/chains';
import { useStoreChain } from '@stores/chain';
import { cn } from '@utils/helpers';

import type {
  IChain,
  ISupportedChains,
} from '@custom-types/chain';
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

export const ChainSelector = () => {
  const { setChain } = useStoreChain.use.actions();

  const [selectedChainGroup, setSelectedChainGroup] = useState('');
  const [filteredChains, setFilteredChains] = useState<ISupportedChains['<chain_name>']['chains']>(ALL_CHAINS);
  const [query, setQuery] = useState('');

  useEventBus<IEventBusSearchChain>('@@-search-chain', ({ data }) => {
    setQuery(data);
  });

  const handleSelectGroup = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const chain = e.currentTarget.getAttribute('data-chain-group') || '';
    if (chain === selectedChainGroup) {
      setSelectedChainGroup('');
    } else {
      setSelectedChainGroup(chain);
    }
  }, [selectedChainGroup]);

  const handleSetChain = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const chainId = e.currentTarget.getAttribute('data-chain-id') || '';
    const chain = SUPPORTED_CHAINS[chainId].chains.find(c => c.id === chainId);

    if (chain) {
      setChain(chain);
      busDispatch<IEventBusSetChain>({
        type: '@@-set-chain',
        data: chain,
      });
    }
  }, [setChain]);

  const filterChainsByQuery = useCallback((chain: IChain) => {
    return chain.id.toLowerCase().startsWith(query.toLowerCase());
  }, [query]);

  useEffect(() => {
    if (selectedChainGroup) {
      setFilteredChains(SUPPORTED_CHAINS[selectedChainGroup].chains.filter(filterChainsByQuery));
    } else {
      setFilteredChains(ALL_CHAINS.filter(filterChainsByQuery));
    }
  }, [selectedChainGroup, filterChainsByQuery]);

  return (
    <div className="grid grid-cols-chainSelect">
      <PDScrollArea>
        <ul className="bg-dev-purple-100 p-2 dark:bg-dev-black-900">
          {
            CHAINS.map(chain => {
              return (
                <li
                  key={`chain-${chain}`}
                >
                  <button
                    type="button"
                    data-chain-group={chain}
                    onClick={handleSelectGroup}
                    className={cn(
                      'w-full p-4 text-left',
                      'font-geist !text-body2-regular',
                      'transition-colors',
                      ' hover:bg-dev-purple-200 dark:hover:bg-dev-purple-400/20',
                      { ['text-dev-pink-500']: chain === selectedChainGroup },
                    )}
                  >
                    {SUPPORTED_CHAINS[chain].name}
                  </button>
                </li>
              );
            })
          }
        </ul>
      </PDScrollArea>
      <PDScrollArea>
        <div className="flex flex-col gap-2 self-stretch p-2">
          {query && <span className="font-geist text-body2-regular">Search Results for "{query}"</span>}
          {
            filteredChains.length > 0
              ? (
                <>
                  <ul className={cn(
                    'grid gap-2 [&>li]:h-[64px]',
                    'lg:grid-cols-4',
                    'md:grid-cols-2',
                    'grid-cols-1',
                  )}
                  >
                    {
                      filteredChains.map(chain => {
                        return (
                          <li
                            key={`chain-list-${chain.name}`}
                          >
                            <button
                              type="button"
                              data-chain-id={chain.id}
                              onClick={handleSetChain}
                              className={cn(
                                'flex w-full items-center gap-3 p-4',
                                'transition-colors',
                                'hover:bg-dev-purple-200 dark:hover:bg-dev-black-800',
                              )}
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
                        );
                      })
                    }
                  </ul>
                </>
              )
              : (
                <span className="my-5 flex flex-1 items-center justify-center">No Results</span>
              )
          }
        </div>
      </PDScrollArea>
    </div>
  );
};
