/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { InvocationMapper } from '@components/invocationArgsMapper/invocationMapper';
import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { buildArrayState } from '@utils/invocationMapper';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { ITupleBuilder } from '@components/invocationArgsMapper/types';

export const TupleBuilderCore = ({
  tuple,
  onChange,
}: ITupleBuilder) => {
  const [
    params,
    setParams,
  ] = useState(buildArrayState(tuple.value.length));

  const handleOnChange = useCallback((index: number, value: unknown) => {
    setParams((tuple) => {
      const newParams = [...tuple];
      newParams[index] = value;
      onChange(newParams);
      return newParams;
    });
  }, []);

  useEffect(() => {
    onChange(params);
  }, []);

  try {
    if (!tuple) {
      return null;
    } else {
      return (
        <div className={styles.invocationContainer}>
          {
            tuple?.value?.map((entry, index) => (
              <InvocationMapper
                key={`tuple-invocation-${entry.id}-${index}`}
                invokationVar={entry}
                onChange={(value) => handleOnChange(index, value)}
              />
            ))
          }
        </div>
      );
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};
