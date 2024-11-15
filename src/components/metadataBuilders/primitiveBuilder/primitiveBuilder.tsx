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

  const getNumericProps = () => (
    {
      type: 'number',
      inputMode: 'numeric' as const,
      onWheelCapture: onWheelPreventDefault,
    }
  );

  const getPrimitiveProps = () => (
    {
      placeholder: placeholder || primitive.value,
      value: primValue,
      className: styles.invocationInputField,
      onChange: (event: ChangeEvent<HTMLInputElement>) => setPrimValue(event.target.value),
      readOnly: !!readOnly,
    }
  );

  useEffect(() => {
    onChange(handlePrimitiveInputChange(primitive, primValue));
  }, [primValue]);

  const primitiveRenderers: Record<string, JSX.Element> = {
    i8: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u8: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    i16: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u16: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    i32: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u32: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    i64: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u64: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    i128: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u128: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    i256: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    u256: <input
      {...getPrimitiveProps()}
      {...getNumericProps()}
    />,
    str: <input {...getPrimitiveProps()} />,
    bool: (
      <PDSwitch
        checked={Boolean(primValue)}
        onChange={handlePDSwitchChange}
      />
    ),
    char: (
      <input
        {...getPrimitiveProps()}
        maxLength={1}
      />
    ),
  };
  return primitiveRenderers[primitive.value] || <NotImplemented />;
};

export default PrimitiveBuilder;
