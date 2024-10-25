/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { InvocationMapper } from '@components/invocationArgsMapper/invocationMapper';
import { buildArrayState } from '@utils/invocationMapper';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IArrayVarBuilder } from '@components/invocationArgsMapper/types';

export const ArrayVarBuilderCore = ({ array, onChange }: IArrayVarBuilder) => {
  const [
    arrayProps,
    setArrayProps,
  ] = useState(buildArrayState(array.len || 0));

  const handleUpdateVals = useCallback((vals: unknown[]) => {
    onChange(vals.some((val) => !Boolean(val)) ? undefined : vals);
  }, []);

  useEffect(() => {
    handleUpdateVals(arrayProps);
  }, [arrayProps]);

  const handleOnChange = useCallback((index: number, args: unknown) => {
    setArrayProps((props) => {
      const newArrayProps = [...props];
      newArrayProps[index] = args;
      return newArrayProps;
    });
  }, []);

  return (
    <div className={styles.invocationGroup}>
      {
        arrayProps.map((arrProp, index) => {
          return (
            <InvocationMapper
              key={`array-var-${index}`}
              invokationVar={array.value}
              onChange={(args) => handleOnChange(index, args)}
            />
          );
        })
      }
    </div>
  );
};
