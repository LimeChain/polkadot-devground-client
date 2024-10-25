/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSwitch } from '@components/pdSwitch';

import { InvocationMapper } from '../../invocationArgsMapper/invocationMapper';
import styles from '../../invocationArgsMapper/styles.module.css';

import type { IOptionBuilder } from '@components/invocationArgsMapper/types';

const OptionBuilder = ({ option, onChange }: IOptionBuilder) => {
  const [
    shouldIncludeOption,
    setShouldIncludeOption,
  ] = useState(false);
  const [
    value,
    setValue,
  ] = useState(undefined);

  const handleOnSwitch = useCallback(() => {
    setShouldIncludeOption((shouldInclude) => !shouldInclude);
  }, []);

  const handleOnChange = useCallback((args: unknown) => {
    setValue(args as undefined);
  }, []);

  useEffect(() => {
    onChange(shouldIncludeOption ? value : undefined);
  }, [
    value,
    shouldIncludeOption,
  ]);

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={shouldIncludeOption}
        onChange={handleOnSwitch}
        title="Include Option"
      />
      {
        shouldIncludeOption && (
          <InvocationMapper
            invokationVar={option.value}
            onChange={handleOnChange}
          />
        )
      }
    </div>
  );
};

export default OptionBuilder;
