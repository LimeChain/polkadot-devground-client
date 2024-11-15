import type { IPDSelectItem } from '@components/pdSelect';
import type { IRpcCalls } from '@constants/rpcCalls/types';

export const mapRpcCallsToSelectPalletItems = (rpcCalls: IRpcCalls) => {
  return Object.keys(rpcCalls).reduce((acc, curr) => {
    const pallet = curr.split('_').at(0);

    if (pallet && !acc.some((p) => p.value === pallet)) {
      acc.push({
        label: pallet,
        value: pallet,
        key: `rpc-pallet-${pallet}`,
      });
    }

    return acc;
  }, [] as IPDSelectItem[]);
};

export const mapRpcCallsToSelectMethodItems = (
  {
    rpcCalls,
    ifPalletEquals,
  }: {
    rpcCalls: IRpcCalls;
    ifPalletEquals?: string;
  }) => {

  return Object.keys(rpcCalls).reduce((acc, curr) => {
    const call = curr.split('_');
    const pallet = call.at(0);

    if (pallet && pallet === ifPalletEquals) {
      const val = call.slice(1).join('_');
      acc.push({
        label: val,
        value: val,
        key: `rpc-method-${val}`,
      });
    }

    return acc;
  }, [] as IPDSelectItem[]);
};
