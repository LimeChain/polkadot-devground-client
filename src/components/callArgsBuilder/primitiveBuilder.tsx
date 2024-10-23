import {
  type ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { PDSwitch } from '@components/pdSwitch';
import { onWheelPreventDefault } from '@utils/callbacks';

import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { PrimitiveVar } from '@polkadot-api/metadata-builders';

interface IPrimitiveBuilder extends ICallArgs {
  primitive: PrimitiveVar;
  placeholder?: string;
  readOnly?: boolean;
}

export const PrimitiveBuilder = ({
  primitive,
  onChange,
  placeholder,
  readOnly,
}: IPrimitiveBuilder) => {
  const [
    value,
    setValue,
  ] = useState('');

  const commonProps = {
    placeholder: placeholder || primitive.value,
    value,
    className: styles.codecInput,
    onChange: (event: ChangeEvent<HTMLInputElement>) =>
      setValue(event.target.value),
    readOnly: !!readOnly,
  };

  const commonNumberInputProps = {
    ...commonProps,
    type: 'number',
    inputMode: 'numeric',
    onWheelCapture: onWheelPreventDefault,
  } as const;

  useEffect(() => {
    switch (primitive.value) {
      case 'bool':
        onChange(Boolean(value));
        break;
      case 'char':
      case 'str':
        onChange(value);
        break;
      case 'u8':
      case 'i8':
      case 'u16':
      case 'i16':
      case 'u32':
      case 'i32':
        onChange(Number(value));
        break;
      case 'u64':
      case 'i64':
      case 'u128':
      case 'i128':
      case 'u256':
      case 'i256':
        onChange(BigInt(Number(value).toFixed(0)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  switch (primitive.value) {
    case 'bool':
      return (
        <PDSwitch
          checked={Boolean(value)}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={() => setValue((val) => Boolean(val) ? '' : 'true')}
        />
      );
    case 'char':
      return (
        <input
          {...commonProps}
          maxLength={1}
        />
      );
    case 'str':
      return <input {...commonProps} />;
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
    default:
      return 'not implmented';
  }
};
