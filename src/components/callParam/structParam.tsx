import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { CodecParam } from './codecParam';
import styles from './styles.module.css';

import { type ICallArgs } from '.';

import type { StructVar } from '@polkadot-api/metadata-builders';

interface IStructParam extends ICallArgs {
  struct: StructVar;
}

export const StructParam = ({ struct, onChange }: IStructParam) => {
  const [
    args,
    setArgs,
  ] = useState(() =>
    Object.fromEntries(
      Object.keys(struct.value).map((key) => [
        key,
        undefined,
      ] as const),
    ),
  );

  useEffect(() => {
    onChange(args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleOnChange = useCallback((key: string, value: unknown) => {
    setArgs((args) => ({ ...args, [key]: value } as typeof args));
  }, []);

  return Object.entries(struct.value).map(([
    key,
    value,
  ], index) => {
    return (
      <div key={`${key}-${index}-${value.id}`}>
        <span className="block pb-1 font-geist font-body1-regular">
          {key}
        </span>
        <div className={styles.codecContainer}>
          <CodecParam
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(args) => handleOnChange(key, args)}
            variable={value}
          />
        </div>
      </div>
    );
  });
};
