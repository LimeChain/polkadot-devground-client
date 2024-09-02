import {
  useEffect,
  useState,
} from 'react';

import { BinaryParam } from './BinaryParam';
import { CodecParam } from './CodecParam';
import styles from './styles.module.css';

import type { ICallArgs } from '.';
import type { TupleVar } from '@polkadot-api/metadata-builders';
interface ISequence extends ICallArgs {
  tuple: TupleVar;
}

export const TupleParam = ({ tuple, onChange }: ISequence) => {
  if (
    tuple.value.every((lookupEntry) =>
      lookupEntry.type === 'primitive' && lookupEntry.value === 'u8')
  ) {
    return (
      <div className="border-l pl-4 pt-2">
        <BinaryParam onChange={onChange} minLength={0} />;
      </div>
    );
  }

  return (
    <_TupleParam
      tuple={tuple}
      onChange={onChange}
    />
  );
};

export const _TupleParam = ({
  tuple,
  onChange,
}: ISequence) => {
  const [params, setParams] = useState(Array.from({ length: tuple.value.length }).fill(undefined));
  console.log('TUPLE');

  useEffect(() => {
    onChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return (
    <div className={styles.codecContainer}>
      {
        tuple.value.map((entry, index) => (
          <CodecParam
            key={`tuple-param-${index}`}
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
