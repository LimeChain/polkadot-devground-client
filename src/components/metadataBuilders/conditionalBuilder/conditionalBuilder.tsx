/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSwitch } from '@components/pdSwitch';

import { InvocationMapper } from '../../invocationArgsMapper/invocationMapper';
import styles from '../../invocationArgsMapper/styles.module.css';

import type { IConditionalBuilder } from '@components/invocationArgsMapper/types';

const ConditionalParamBuilder = ({ condition, onChange }: IConditionalBuilder) => {
  const [
    paramValue,
    setParamValue,
  ] = useState(undefined);
  const [
    showParam,
    setShowParam,
  ] = useState(false);

  const handleOnChange = useCallback((args: unknown) => {
    setParamValue(args as undefined);
  }, []);

  const handleOnSwitch = useCallback(() => {
    setShowParam((show) => !show);
  }, []);

  useEffect(() => {
    let value = undefined;
    if (showParam) {
      value = paramValue;
    }
    onChange(value);
  }, [
    paramValue,
    showParam,
  ]);

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={showParam}
        onChange={handleOnSwitch}
        title="Include Option"
      />
      {
        showParam
          ? (
            <InvocationMapper
              invokationVar={condition.value}
              onChange={handleOnChange}
            />
          )
          : null
      }
    </div>
  );
};

export default ConditionalParamBuilder;
