/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { PDSelect } from '@components/pdSelect';

import { InvocationMapper } from '../../invocationArgsMapper/invocationMapper';
import styles from '../../invocationArgsMapper/styles.module.css';

import type { IEnumBuilder } from '@components/invocationArgsMapper/types';

const EnumBuilder = ({ onChange, ...props }: IEnumBuilder) => {
  const enumPropsValue = props.enum;
  const enumOptions = Object.keys(enumPropsValue.value);

  const selectItems = useMemo(() => {
    return enumOptions.map((key, index) => ({
      label: key,
      value: key,
      key: `enum-select-${key}-${index}`,
    }));
  }, [enumOptions]);

  const [
    option,
    setOption,
  ] = useState(enumOptions.at(0)!);

  const handleSetValue = useCallback((args: unknown) => {
    onChange({ type: option, value: args });
  }, [option]);

  const enumValue = enumPropsValue.value[option];
  const getEnumVariable = () => {
    if (!enumValue) {
      return undefined;
    } else {
      if (enumValue.type !== 'lookupEntry') {
        return enumValue;
      } else {
        return enumValue.value;
      }
    }
  };
  const enumVariable = getEnumVariable();

  useEffect(() => {
    if (enumVariable?.type === 'void') {
      handleSetValue(undefined);
    }
  }, [
    option,
    enumVariable,
    handleSetValue,
  ]);

  return (
    <div className={styles.invocationGroup}>
      <PDSelect
        items={[selectItems]}
        onChange={setOption}
        value={option}
      />
      {
        enumVariable
          ? (
            <div className={styles.invocationContainer}>
              <InvocationMapper
                key={`${enumVariable.type}-${(enumVariable as { id: number })?.id}`}
                invokationVar={enumVariable}
                onChange={handleSetValue}
              />
            </div>
          )
          : null
      }
    </div>
  );
};

export default EnumBuilder;
