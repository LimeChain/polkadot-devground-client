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

  const primitiveRenderers: Record<string, JSX.Element> = {
    i8: <input {...commonNumberInputProps} />,
    u8: <input {...commonNumberInputProps} />,
    i16: <input {...commonNumberInputProps} />,
    u16: <input {...commonNumberInputProps} />,
    i32: <input {...commonNumberInputProps} />,
    u32: <input {...commonNumberInputProps} />,
    i64: <input {...commonNumberInputProps} />,
    u64: <input {...commonNumberInputProps} />,
    i128: <input {...commonNumberInputProps} />,
    u128: <input {...commonNumberInputProps} />,
    i256: <input {...commonNumberInputProps} />,
    u256: <input {...commonNumberInputProps} />,
    str: <input {...commonProps} />,
    bool: (
      <PDSwitch
        checked={Boolean(primValue)}
        onChange={handlePDSwitchChange}
      />
    ),
    char: (
      <input
        {...commonProps}
        maxLength={1}
      />
    ),
  };
  return primitiveRenderers[primitive.value] || <NotImplemented />;
};

export default PrimitiveBuilder;
