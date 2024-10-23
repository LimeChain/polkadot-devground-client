import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { CodecBuilder } from './codecBuilder';
import styles from './styles.module.css';

import { type ICallArgs } from '.';

import type { StructVar } from '@polkadot-api/metadata-builders';

interface IStructBuilder extends ICallArgs {
  struct: StructVar;
}

interface Args {
  key: string;
  value: unknown;
}

export const StructBuilder = ({ struct, onChange }: IStructBuilder) => {
  const [
    args,
    setArgs,
  ] = useState(() =>
    Object.keys(struct.value)
      .reduce((acc: { [key: Args['key']]: Args['value'] }, key) => {
        acc[key] = undefined;
        return acc;
      }, {}),
  );

  useEffect(() => {
    onChange(args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleOnChange = useCallback((key: Args['key'], value: Args['value']) => {
    setArgs((args) => ({ ...args, [key]: value } as typeof args));
  }, []);

  return Object.entries(struct.value)
    .map(([
      key,
      value,
    ], index) => {
      return (
        <div key={`${key}-${index}-${value.id}`}>
          <span className="block pb-1 font-geist font-body1-regular">
            {key}
          </span>
          <div className={styles.codecContainer}>
            <CodecBuilder
              key={`struct-param-${value.id}`}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(args) => handleOnChange(key, args)}
              variable={value}
            />
          </div>
        </div>
      );
    });
};
