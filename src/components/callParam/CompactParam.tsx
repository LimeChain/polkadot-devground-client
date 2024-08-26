import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import type { ICallArgs } from '.';
import type { CompactVar } from '@polkadot-api/metadata-builders';

interface ICompactParam extends ICallArgs {
  compact: CompactVar;
}

export function CompactParam({ compact, onChange }: ICompactParam) {
  const [value, setValue] = useState('');

  useEffect(() => {
    onChange(compact.isBig ? BigInt(value) : Number(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <input
      type="number"
      inputMode="numeric"
      placeholder="Compact"
      min={
        compact.isBig
          ? '-57896044618658097711785492504343953926634992332820282019728792003956564819968'
          : -2147483648
      }
      max={
        compact.isBig ? '170141183460469231731687303715884105727' : 4294967295
      }
      onChange={handleChange}
    />
  );
}
