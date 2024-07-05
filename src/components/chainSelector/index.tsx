import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDScrollArea } from '@components/scrollArea';
import {
  type ISupportedChains,
  SUPPORTED_CHAINS,
} from '@constants/chains';
import { cn } from '@utils/helpers';

const CHAINS = Object.keys(SUPPORTED_CHAINS);
const ALL_CHAINS = CHAINS.reduce((acc :ISupportedChains['<chain_name>']['chains'], curr) => {
  SUPPORTED_CHAINS[curr].chains.forEach(chain => {
    acc.push(chain);
  });
  return acc;  
}, []);

const ChainSelector = () => {

  const [selectedChain, setSelectedChain] = useState('');
  const [filteredChains, setFilteredChains] = useState<ISupportedChains['<chain_name>']['chains']>(ALL_CHAINS);

  const handleSelectGroup = useCallback((chain:string) => {
    if (chain === selectedChain) {
      setSelectedChain('');
    } else {
      setSelectedChain(chain);
    }
  }, [selectedChain]);

  useEffect(() => {
    if (selectedChain) {
      setFilteredChains(SUPPORTED_CHAINS[selectedChain].chains);
    } else {
      setFilteredChains(ALL_CHAINS);
    }
  }, [selectedChain]);

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
                onClick={() => handleSelectGroup(chain)}
                className={cn(
                  'w-full p-4 text-left',
                  'font-geist !text-body2-regular',
                  'transition-colors',
                  ' hover:bg-dev-purple-200 dark:hover:bg-dev-purple-400/20',
                  { 'text-dev-pink-500': chain === selectedChain },
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
        {filteredChains.map(chain => (
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
        )}
      </ul>
    </div>
  );
};

export default ChainSelector;