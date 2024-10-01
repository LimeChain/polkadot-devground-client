import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { onWheelPreventDefault } from '@utils/callbacks';

import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { CompactVar } from '@polkadot-api/metadata-builders';
interface ICompactParam extends ICallArgs {
  compact: CompactVar;
}

export const CompactParam = ({ compact, onChange }: ICompactParam) => {
  const [
    value,
    setValue,
  ] = useState('0');

  useEffect(() => {
    onChange(compact.isBig ? BigInt(Number(value).toFixed(0)) : Number(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  return (
    <input
      className={styles.codecInput}
      inputMode="numeric"
      onChange={handleChange}
      onWheelCapture={onWheelPreventDefault}
      placeholder="Compact"
      type="number"
      max={
        compact.isBig
          ? '170141183460469231731687303715884105727'
          : 4294967295
      }
      min={
        compact.isBig
          ? '-57896044618658097711785492504343953926634992332820282019728792003956564819968'
          : -2147483648
      }
    />
  );
};
