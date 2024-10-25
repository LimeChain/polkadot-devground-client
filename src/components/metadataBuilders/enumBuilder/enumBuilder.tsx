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
  const _enum = props.enum;
  const enumOptions = Object.keys(_enum.value);

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

  const enumValue = _enum.value[option];
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
  const _enumVar = getEnumVariable();

  useEffect(() => {
    if (_enumVar?.type === 'void') {
      handleSetValue(undefined);
    }
  }, [
    option,
    _enumVar,
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
        _enumVar && (
          <div className={styles.invocationContainer}>
            <InvocationMapper
              key={`${_enumVar.type}-${(_enumVar as { id: number })?.id}`} /* used for correct state on enum change */
              invokationVar={_enumVar}
              onChange={handleSetValue}
            />
          </div>
        )
      }
    </div>
  );
};

export default EnumBuilder;
