import {
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Select } from '@components/Select';

import { CodecParam } from './CodecParam';
import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { EnumVar } from '@polkadot-api/metadata-builders';
export interface IEnumParam extends ICallArgs {
  enum: EnumVar;
}

export const EnumParam = ({ onChange, ...props }: IEnumParam) => {
  const enumVar = props.enum;
  const enumKeys = Object.keys(enumVar.value);

  const enumItems = useMemo(() => {
    return enumKeys.map((key, index) => ({
      label: key,
      value: key,
      key: `enum-select-${key}-${index}`,
    }));
  }, [enumKeys]);

  const [key, setKey] = useState(enumKeys.at(0)!);

  const handleSetValue = useCallback((args: unknown) => {
    onChange({ type: key, value: args });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const enumValue = enumVar.value[key];
  const variable = enumValue
    ? enumValue.type === 'lookupEntry'
      ? enumValue.value
      : enumValue
    : undefined;

  return (
    <div className={styles.codecGroup}>
      <Select
        items={enumItems}
        onChange={setKey}
        value={key}
      />
      {
        variable
        && (
          <div className={styles.codecContainer}>
            <CodecParam
              key={`${variable.type}-${variable?.id}`}
              variable={variable}
              onChange={handleSetValue}
            />
          </div>
        )
      }
    </div>
  );
};
