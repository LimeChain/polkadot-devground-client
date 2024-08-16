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
import { PDScrollArea } from '@components/pdScrollArea';
import { SUPPORTED_CHAIN_GROUPS } from '@constants/chain';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import type {
  IChain,
  ISupportedChains,
} from '@custom-types/chain';
import type {
  IEventBusSearchChain,
  IEventBusSetChain,
} from '@custom-types/eventBus';

const CHAIN_GROUPS = Object.keys(SUPPORTED_CHAIN_GROUPS);
const ALL_CHAINS = CHAIN_GROUPS.reduce((acc: ISupportedChains['<chain_name>']['chains'], curr) => {
  SUPPORTED_CHAIN_GROUPS[curr].chains.forEach(chain => {
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
    const chainGroup = e.currentTarget.getAttribute('data-chain-group') || '';
    if (chainGroup === selectedChainGroup) {
      setSelectedChainGroup('');
    } else {
      setSelectedChainGroup(chainGroup);
    }
  }, [selectedChainGroup]);

  const handleSetChain = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const chainId = e.currentTarget.getAttribute('data-chain-id') || '';
    console.log(chainId);

    // const chain = SUPPORTED_CHAIN_GROUPS[chainId].chains.find(c => c.id === chainId);
    const chain = ALL_CHAINS.find(c => c.id === chainId);

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
      setFilteredChains(SUPPORTED_CHAIN_GROUPS[selectedChainGroup].chains.filter(filterChainsByQuery));
    } else {
      setFilteredChains(ALL_CHAINS.filter(filterChainsByQuery));
    }
  }, [selectedChainGroup, filterChainsByQuery]);

  return (
    <div className="grid grid-cols-chainSelect">
      <PDScrollArea>
        <ul className="bg-dev-purple-100 p-2 dark:bg-dev-black-900">
          {
            CHAIN_GROUPS.map(chainGroup => {
              return (
                <li
                  key={`chain-group-${chainGroup}`}
                >
                  <button
                    type="button"
                    data-chain-group={chainGroup}
                    onClick={handleSelectGroup}
                    className={cn(
                      'w-full p-4 text-left',
                      'font-geist font-body2-regular',
                      'transition-colors',
                      ' hover:bg-dev-purple-200 dark:hover:bg-dev-purple-400/20',
                      {
                        ['text-dev-pink-500']: chainGroup === selectedChainGroup,
                      },
                    )}
                  >
                    {SUPPORTED_CHAIN_GROUPS[chainGroup].name}
                  </button>
                </li>
              );
            })
          }
        </ul>
      </PDScrollArea>
      <PDScrollArea>
        <div className="flex flex-col gap-2 self-stretch p-2">
          {
            query && (
              <span className="font-geist font-body2-regular">
                Search Results for "{query}"
              </span>
            )
          }
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
