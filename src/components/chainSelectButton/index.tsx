import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import { useLocation } from 'react-router-dom';

import { Icon } from '@components/icon';
import { ModalChainSelect } from '@components/modals/modalChainSelect';
import { useStoreChain } from '@stores';

const ChainSelectButton = () => {

  const { pathname } = useLocation();
  const isHomePage = pathname === '/';

  const [
    ChainSelectModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalChainSelect);
  const currentChain = useStoreChain.use.chain();

  if (isHomePage) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleVisibility}
        className="flex items-center"
      >
        <Icon name={currentChain.icon} size={[28]}/>
        <h5 className="ml-[6px] mr-3 font-h5-bold">
          {currentChain.name}
        </h5>
        <Icon name="icon-dropdownArrow" size={[16]}/>
      </button>
      <ChainSelectModal onClose={toggleVisibility}/>
    </>
  );
};

export default ChainSelectButton;
