/* eslint-disable react-hooks/exhaustive-deps */
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { onWheelPreventDefault } from '@utils/callbacks';
import { getCompactValue } from '@utils/invocationMapper';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { ICompactBuilder } from '@components/invocationArgsMapper/types';

const CompactVarBuilder = ({ compact, onChange }: ICompactBuilder) => {
  const [
    value,
    setValue,
  ] = useState('0');

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  useEffect(() => {
    onChange(getCompactValue(compact.isBig || false, value));
  }, [value]);

  return (
    <input
      className={styles.invocationInputField}
      inputMode="numeric"
      onChange={handleOnChange}
      onWheelCapture={onWheelPreventDefault}
      placeholder="Compact"
      type="number"
    />
  );
};

export default CompactVarBuilder;
