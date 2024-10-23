import {
  useEffect,
  useState,
} from 'react';

import { varIsBinary } from '@utils/papi/helpers';

import { BinaryBuilder } from './binaryBuilder';
import { CodecBuilder } from './codecBuilder';
import styles from './styles.module.css';

import type { ICallArgs } from './index';
import type { ArrayVar } from '@polkadot-api/metadata-builders';

interface IArrayBuilder extends ICallArgs {
  array: ArrayVar;
}

export const ArrayBuilder = ({ array, onChange }: IArrayBuilder) => {
  if (varIsBinary(array)) {
    return (
      <BinaryBuilder
        minLength={array.len}
        onChange={onChange}
      />
    );
  } else {
    return (
      <ArrayBuilderCore
        key={`array-param-${array.len}-${array.value.id}`}
        array={array}
        onChange={onChange}
      />
    );
  }
};

const ArrayBuilderCore = ({ array, onChange }: IArrayBuilder) => {
  const [
    arrayProps,
    setArrayProps,
  ] = useState(Array.from({ length: array.len }).fill(undefined));

  useEffect(() => {
    if (arrayProps.includes(undefined)) {
      onChange(undefined);
    } else {
      onChange(arrayProps);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayProps]);

  return (
    <div className={styles.codecGroup}>
      {
        arrayProps.map((_, index) => {
          return (
            <CodecBuilder
              key={`array-param-${index}`}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(args) => setArrayProps((props) => [...props.with(index, args)])}
              variable={array.value}
            />
          );
        })
      }
    </div>
  );
};
