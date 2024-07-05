import { useToggleVisibility } from '@pivanov/use-toggle-visibility';

import { Icon } from '@components/icon';
import { ChainSelectModal as _ChainSelectModal } from '@components/modals/chainSelectModal';
import { useStoreChain } from 'src/stores/chain';

const ChainSelectButton = () => {
  const currentChain = useStoreChain.use.chain();
  const [ChainSelectModal, toggleVisibility] = useToggleVisibility(_ChainSelectModal);
  
  return (
    <>
      <button
        type="button"
        className="flex items-center"
        onClick={toggleVisibility}
      >
        <Icon name={currentChain.icon} size={[28]}/>
        <h5 className="ml-[6px] mr-3 text-h5-bold">{currentChain.name}</h5>
        <Icon name="icon-dropdownArrow" size={[16]}/>
      </button>
      <ChainSelectModal onClose={toggleVisibility}/>
    </>
  );
};

export default ChainSelectButton;