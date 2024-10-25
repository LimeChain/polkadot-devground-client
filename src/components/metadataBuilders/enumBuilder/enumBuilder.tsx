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

import type { InvocationOnChangeProps } from '@components/invocationArgsMapper/types';
import type { EnumVar } from '@polkadot-api/metadata-builders';

interface IEnumBuilder extends InvocationOnChangeProps {
  enum: EnumVar;
}

const EnumBuilder = ({ onChange, ...props }: IEnumBuilder) => {
  const enumVar = props.enum;
  const enumKeys = Object.keys(enumVar.value);

  const selectItems = useMemo(() => {
    return enumKeys.map((key, index) => ({
      label: key,
      value: key,
      key: `enum-select-${key}-${index}`,
    }));
  }, [enumKeys]);

  const [
    key,
    setKey,
  ] = useState(enumKeys.at(0)!);

  const handleSetValue = useCallback((args: unknown) => {
    onChange({ type: key, value: args });
  }, [key]);

  const enumValue = enumVar.value[key];
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
    key,
    _enumVar,
    handleSetValue,
  ]);

  return (
    <div className={styles.invocationGroup}>
      <PDSelect
        items={[selectItems]}
        onChange={setKey}
        value={key}
      />
      {
        _enumVar && (
          <div className={styles.invocationContainer}>
            <InvocationMapper
              key={`${_enumVar.type}-${(_enumVar as { id: number })?.id}`} /* used to fix state on enum change */
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
