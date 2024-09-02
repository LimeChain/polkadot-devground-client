import {
  useCallback,
  useState,
} from 'react';

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
    <div>
      <select
        value={key}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(e) => setKey(e.target.value)}
        className={styles.codecSelect}
      >
        {
          enumKeys.map((e, i) => {
            return (
              <option
                key={`enum-${i}-${e}`}
                value={e}
              >
                {e}
              </option>
            );
          })
        }
      </select>
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
