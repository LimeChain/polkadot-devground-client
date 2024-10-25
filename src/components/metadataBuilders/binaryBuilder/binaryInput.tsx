import { Binary } from 'polkadot-api';
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { cn } from '@utils/helpers';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IBinaryBuilder } from '@components/invocationArgsMapper/types';

export const BinaryInput = ({
  onChange,
  minLength,
  placeholder,
  readOnly,
}: IBinaryBuilder) => {
  const requiredHexLength = minLength * 2;

  const requiredBinaryLength = minLength;
  const encodedValue = String().padEnd(requiredHexLength, '0');

  const [
    value,
    setValue,
  ] = useState(requiredHexLength ? `0x${encodedValue}` : '');
  const [
    isError,
    setIsError,
  ] = useState(false);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);
  }, []);

  useEffect(() => {
    const isHex = value.startsWith('0x');

    if (isHex) {
      const _value = Binary.fromHex(value);
      onChange(_value);

      const valueLength = _value.asBytes().length;
      setIsError(minLength ? valueLength !== requiredBinaryLength : false);
    } else {
      const _value = Binary.fromHex(value);
      onChange(_value);

      const valueLength = _value.asBytes().length;
      setIsError(minLength ? valueLength !== requiredBinaryLength : false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      onChange={handleOnChange}
      placeholder={placeholder || 'Binary hex or string'}
      readOnly={readOnly}
      type="text"
      value={value}
      className={cn(
        styles.invocationInputField,
        {
          [styles.invocationInputErrorState]: isError,
        },
      )}
    />
  );
};
