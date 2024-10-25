/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { buildStructState } from '@utils/invocationMapper';

import { InvocationMapper } from '../../invocationArgsMapper/invocationMapper';
import styles from '../../invocationArgsMapper/styles.module.css';

import type {
  IStructBuilder,
  StructArgs,
} from '@components/invocationArgsMapper/types';

const StructBuilder = ({ struct, onChange }: IStructBuilder) => {
  const entries = Object.entries(struct.value);

  const [
    structState,
    setStructState,
  ] = useState(buildStructState(struct));

  const handleOnChange = useCallback((key: StructArgs['key'], value: StructArgs['value']) => {
    setStructState((structState) => {
      const newArgs = { ...structState, [key]: value };
      return newArgs;
    });
  }, []);

  useEffect(() => {
    onChange(structState);
  }, [structState]);

  try {
    if (!entries) {
      return null;
    } else {
      return entries
        .map(([
          key,
          value,
        ], index) => {
          return (
            <div key={`struct-${key}-${index}-${value.id}`}>
              <span className="block pb-1 font-geist font-body1-regular">
                {key}
              </span>
              <div className={styles.invocationContainer}>
                <InvocationMapper
                  key={`struct-invoker-${value.id}`}
                  invokationVar={value}
                  onChange={(args) => handleOnChange(key, args)}
                />
              </div>
            </div>
          );
        });
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};

export default StructBuilder;
