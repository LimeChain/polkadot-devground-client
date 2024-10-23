import {
  useEffect,
  useState,
} from 'react';

import { varIsBinary } from '@utils/papi/helpers';

import { BinaryBuilder } from './binaryBuilder';
import { CodecBuilder } from './codecBuilder';
import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { TupleVar } from '@polkadot-api/metadata-builders';

interface ITupleBuilder extends ICallArgs {
  tuple: TupleVar;
}

export const TupleBuilder = ({ tuple, onChange }: ITupleBuilder) => {
  if (varIsBinary(tuple)) {
    return (
      <div className="border-l pl-4 pt-2">
        <BinaryBuilder
          minLength={0}
          onChange={onChange}
        />
      </div>
    );
  } else {
    return (
      <TupleBuilderCore
        onChange={onChange}
        tuple={tuple}
      />
    );
  }
};

const TupleBuilderCore = ({
  tuple,
  onChange,
}: ITupleBuilder) => {
  const [
    params,
    setParams,
  ] = useState(
    Array
      .from({ length: tuple.value.length })
      .fill(undefined),
  );

  useEffect(() => {
    onChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className={styles.codecContainer}>
      {
        tuple.value.map((entry, index) => (
          <CodecBuilder
            key={`tuple-param-${entry.id}-${index}`}
            variable={entry}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(value) =>
              setParams((tuple) => tuple.with(index, value))
            }
          />
        ))
      }
    </div>
  );
};
