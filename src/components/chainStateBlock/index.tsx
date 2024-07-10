import {
  useCallback,
  useRef,
} from 'react';

import { Icon } from '@components/icon';

interface IChainStateBlockProps {
  type:
  'latest-block' |
  'finalised-block' |
  'signed-extrinsics' |
  'transfers' |
  'total-accounts' |
  'circulating-supply';
}

export const ChainStateBlock = ({ type }: IChainStateBlockProps) => {

  const refIconName = useRef<string>('');

  const getIconName = useCallback(() => {
    switch (type) {
      case 'latest-block': {
        return refIconName.current = 'icon-newBlock';
      }
      case 'finalised-block': {
        return refIconName.current = 'icon-blocks';
      }
      case 'signed-extrinsics': {
        return refIconName.current = 'icon-transfer';
      }
      case 'circulating-supply': {
        return refIconName.current = 'icon-transfer';
      }
      case 'total-accounts': {
        return refIconName.current = 'icon-transfer';
      }
      case 'transfers': {
        return refIconName.current = 'icon-transfer';
      }
      default: {
        return refIconName.current = 'icon-transfer';
      }
    }
  }, [type]);

  return (
    <div>
      <Icon name={getIconName()} size={[16]} />
    </div>
  );
};
