import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { onWheelPreventDefault } from '@utils/callbacks';

import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { CompactVar } from '@polkadot-api/metadata-builders';

interface ICompactBuilder extends ICallArgs {
  compact: CompactVar;
}

export const CompactBuilder = ({ compact, onChange }: ICompactBuilder) => {
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
    />
  );
};
