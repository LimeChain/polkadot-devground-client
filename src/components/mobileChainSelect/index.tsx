import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/pdScrollArea';
import { SearchChain } from '@components/searchChain';
import { SUPPORTED_CHAIN_GROUPS } from '@constants/chain';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import type {
  ISupportedChainGroups,
  TChain,
} from '@custom-types/chain';
import type {
  IEventBusNavLinkClick,
  IEventBusSearchChain,
  IEventBusSetChain,
} from '@custom-types/eventBus';

const filterChainsByGroup = (query: string) => {
  return Object.values(SUPPORTED_CHAIN_GROUPS).reduce((acc: { chains: TChain[]; name: string }[], group) => {
    const filteredChains = group.chains.filter((chain) =>
      chain.name.toLowerCase().includes(query.toLowerCase()),
    );

    if (filteredChains.length > 0) {
      acc.push({
        ...group,
        chains: filteredChains,
      });
    }

    return acc;
  }, []);
};

const CHAIN_GROUPS = Object.keys(SUPPORTED_CHAIN_GROUPS);
const ALL_CHAINS = CHAIN_GROUPS.reduce((acc: ISupportedChainGroups['<chain_name>']['chains'], curr) => {
  SUPPORTED_CHAIN_GROUPS[curr].chains.forEach((chain) => {
    acc.push(chain);
  });
  return acc;
}, []);

export const MobileChainSelect = () => {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);
  const [
    query,
    setQuery,
  ] = useState('');
  const currentChain = useStoreChain.use.chain();
  const { setChain } = useStoreChain.use.actions();

  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const handleMenuClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const filteredGroups = filterChainsByGroup(query);

  const handleSetChain = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const chainId = e.currentTarget.getAttribute('data-chain-id') || '';
    const chain = ALL_CHAINS.find((c) => c.id === chainId);

    if (chain) {
      setChain(chain);
      busDispatch<IEventBusSetChain>({
        type: '@@-set-chain',
        data: chain,
      });
    }

    setIsOpen(false);
  }, [setChain]);

  useEventBus<IEventBusNavLinkClick>('@@-navlink-click', () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  useEventBus<IEventBusSearchChain>('@@-search-chain', ({ data }) => {
    setQuery(data);
  });

  if (isHomePage) {
    return null;
  }

  return (
    <>
      <button
        className="flex items-center gap-1"
        onClick={handleMenuClick}
        type="button"
      >
        <Icon
          name={currentChain.icon}
          size={[28]}
        />
        <Icon
          name="icon-dropdownArrow"
          size={[16]}
        />
      </button>
      <div
        className={cn(
          'fixed left-0 top-0 z-[9999]',
          'pt-6',
          'size-full',
          'transition-transform duration-300 ease-in-out',
          'bg-dev-purple-50 shadow-lg dark:bg-dev-black-1000',
          {
            ['transform -translate-y-full']: !isOpen,
            ['transform translate-y-0']: isOpen,
          },
        )}
      >
        <PDScrollArea className="px-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon
                name={currentChain.icon}
                size={[28]}
              />
              <h5 className="ml-1 mr-3 font-h5-bold">{currentChain.name}</h5>
            </div>
            <button
              className="p-4"
              onClick={handleMenuClick}
            >
              <Icon name="icon-close" />
            </button>
          </div>

          <SearchChain />

          {
            filteredGroups.length > 0
              ? (
                filteredGroups.map((group) => (
                  <div
                    key={group.name}
                    className="mt-6"
                  >
                    <h3 className="text-pink-500">{group.name}</h3>
                    <ul className="mt-2 space-y-2">
                      {group.chains.map((chain) => (
                        <li
                          key={chain.name}
                          className="flex items-center py-5"
                          data-chain-id={chain.id}
                          onClick={handleSetChain}
                        >
                          <Icon
                            name={chain.icon}
                            size={[28]}
                          />
                          <span className="ml-3">{chain.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )
              : (
                <p className="mt-2">
                  No results found for "
                  {query}
                  ".
                </p>
              )
          }
        </PDScrollArea>
      </div>
    </>
  );
};
