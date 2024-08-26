import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  CallParam,
  type ICallParam,
} from '@components/callParam';
import { useStoreChain } from '@stores';

// Var,
import type { EnumVar } from '@polkadot-api/metadata-builders';
import type { V14 } from '@polkadot-api/substrate-bindings';

const PalletSelect = ({
  pallets,
  onPalletSelect,
}: {
  pallets: V14['pallets'];
  onPalletSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
},
) => {
  return (
    <select
      name="pallet"
      onChange={onPalletSelect}
    >
      {
        pallets?.map((ex, index) => {
          return (
            <option
              key={`pallet-${ex.name}`}
              id={ex.name}
              value={index}
            >
              {ex.name}
            </option>
          );
        })
      }
    </select>
  );
};

const CallSelect = ({
  calls,
  onCallSelect,
}: {
    calls: Omit<ICallParam, 'pallet' | 'onChange'>[];
  onCallSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  },
) => {
  return (
    <select
      name="call"
      onChange={onCallSelect}
    >
      {calls.map((call, index) => {
        return (
          <option
            key={`call-${call.name}`}
            value={index}
          >
            {call.name}
          </option>
        );
      })};
    </select>
  );

};

const RpcCalls = () => {
  const metadata = useStoreChain?.use?.metadata?.();
  const lookup = useStoreChain?.use?.lookup?.();
  const palletsWithCalls = useMemo(() => metadata?.pallets?.filter(p => p.calls), [metadata]);

  const [palletSelected, setPalledSelected] = useState(palletsWithCalls?.[0]);
  const [callArgs, setCallArgs] = useState<unknown>();

  useEffect(() => {
    if (palletsWithCalls) {
      setPalledSelected(palletsWithCalls[0]);
    }
  }, [palletsWithCalls]);

  const palletCalls = useMemo(() => lookup?.(palletSelected?.calls || 0) as EnumVar, [palletSelected, lookup]);
  const calls = useMemo(() => Object.entries(palletCalls?.value || {}).map(([name, param]) => ({
    name,
    param,
  })), [palletCalls]);

  const [callSelected, setCallSelected] = useState(calls.at(0));

  useEffect(() => {
    if (calls) {
      setCallSelected(calls.at(0));
    }
  }, [calls]);

  const handlePalletSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (palletsWithCalls) {
      setPalledSelected(palletsWithCalls[Number(e.target.value)]);
      setCallArgs({});
    }
  }, [palletsWithCalls]);

  const handleCallSelect = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    if (calls.length > 0) {
      setCallSelected(calls.at(Number(e.target.value)));
      setCallArgs({});
    }
  }, [calls]);

  if (!metadata || !lookup || !palletsWithCalls) {
    return 'Loading...';
  }

  return (
    <>
      <div>
        <PalletSelect
          pallets={palletsWithCalls}
          onPalletSelect={handlePalletSelect}
        />
        {
          palletSelected?.calls
          && (
            <CallSelect
              key={`call-select-${palletSelected.name}`}
              calls={calls}
              onCallSelect={handleCallSelect}
            />
          )
        }
      </div >
      {
        palletSelected && callSelected
        && (
          <CallParam
            key={`call-param-${callSelected.name}`}
            pallet={palletSelected}
            name={callSelected.name}
            param={callSelected.param}
            onChange={setCallArgs}
          />
        )
      }
    </>
  );
};

export default RpcCalls;
