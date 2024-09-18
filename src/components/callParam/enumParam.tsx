import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import { CodecParam } from './codecParam';
import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { EnumVar } from '@polkadot-api/metadata-builders';
interface IEnumParam extends ICallArgs {
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

  const [
    key,
    setKey,
  ] = useState(enumKeys.at(0)!);

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

  useEffect(() => {
    if (variable?.type === 'void') {
      handleSetValue(undefined);
    }
  }, [key, variable, handleSetValue]);

  return (
    <div className={styles.codecGroup}>
      <PDSelect
        items={enumItems}
        onChange={setKey}
        value={key}
      />
      {
        variable && (
          <div className={styles.codecContainer}>
            <CodecParam
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              key={`${variable.type}-${(variable as any)?.id}`} /* used to fix state on enum change */
              onChange={handleSetValue}
              variable={variable}
            />
          </div>
        )
      }
    </div>
  );
};
