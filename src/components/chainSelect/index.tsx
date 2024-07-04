import { Icon } from '@components/icon';

const ChainSelect = () => {
  return (
    <button type="button" className="flex items-center">
      <Icon name="icon-chain-polkadot" size={[28]}/>
      <h5 className="ml-[6px] mr-3 text-h5-bold">Polkadot</h5>
      <Icon name="icon-dropdownArrow" size={[16]}/>
    </button>
  );
};

export default ChainSelect;