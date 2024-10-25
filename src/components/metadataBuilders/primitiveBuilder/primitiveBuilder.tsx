/* eslint-disable react-hooks/exhaustive-deps */
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { PDSwitch } from '@components/pdSwitch';
import { onWheelPreventDefault } from '@utils/callbacks';
import { handlePrimitiveInputChange } from '@utils/invocationMapper';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IPrimitiveBuilder } from '@components/invocationArgsMapper/types';

const PrimitiveBuilder = ({
  primitive,
  onChange,
  placeholder,
  readOnly,
}: IPrimitiveBuilder) => {
  const [
    primValue,
    setPrimValue,
  ] = useState('');

  const handlePDSwitchChange = useCallback(() => {
    setPrimValue((val) => Boolean(val) ? '' : 'true');
  }, []);

  const commonProps = {
    placeholder: placeholder || primitive.value,
    value: primValue,
    className: styles.invocationInputField,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setPrimValue(event.target.value),
    readOnly: !!readOnly,
  };

  const commonNumberInputProps = {
    ...commonProps,
    type: 'number',
    inputMode: 'numeric',
    onWheelCapture: onWheelPreventDefault,
  } as const;

  useEffect(() => {
    onChange(handlePrimitiveInputChange(primitive, primValue));
  }, [primValue]);

  switch (primitive.value) {
    case 'i8':
    case 'u8':
    case 'i16':
    case 'u16':
    case 'i32':
    case 'u32':
    case 'i64':
    case 'u64':
    case 'i128':
    case 'u128':
    case 'i256':
    case 'u256':
      return (
        <input
          {...commonNumberInputProps}
        />
      );
    case 'str':
      return <input {...commonProps} />;
    case 'bool':
      return (
        <PDSwitch
          checked={Boolean(primValue)}
          onChange={handlePDSwitchChange}
        />
      );
    case 'char':
      return (
        <input
          {...commonProps}
          maxLength={1}
        />
      );
    default:
      return <NotImplemented />;
  }
};

export default PrimitiveBuilder;
