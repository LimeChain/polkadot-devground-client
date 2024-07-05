import { useToggleVisibility } from '@pivanov/use-toggle-visibility';

import { Icon } from '@components/icon';
import { ChainSelectModal as _ChainSelectModal } from '@components/modals/chainSelectModal';

const ChainSelectButton = () => {
  const [ChainSelectModal, toggleVisibility] = useToggleVisibility(_ChainSelectModal);
  
  return (
    <>
      <button
        type="button"
        className="flex items-center"
        onClick={toggleVisibility}
      >
        <Icon name="icon-chain-polkadot" size={[28]}/>
        <h5 className="ml-[6px] mr-3 text-h5-bold">Polkadot</h5>
        <Icon name="icon-dropdownArrow" size={[16]}/>
      </button>
      <ChainSelectModal onClose={toggleVisibility}/>
    </>
  );
};

export default ChainSelectButton;