import {
  useEffect,
  useState,
} from 'react';

import { BinaryParam } from './BinaryParam';
import { CodecParam } from './CodecParam';

import type { ICallArgs } from '.';
import type { ArrayVar } from '@polkadot-api/metadata-builders';

export interface IArrayParam extends ICallArgs {
  array: ArrayVar;
}

export const ArrayParam = ({ array, onChange }: IArrayParam) => {

  if (array.value.type === 'primitive' && array.value.value === 'u8') {
    return <BinaryParam onChange={onChange} />;
  }

  return <_ArrayParam array={array} onChange={onChange} />;
};

const _ArrayParam = ({ array, onChange }: IArrayParam) => {
  const [arrayProps, setArrayProps] = useState(Array.from({ length: array.len }).fill(undefined));

  useEffect(() => {
    if (arrayProps.includes(undefined)) {
      onChange(undefined);
    } else {
      onChange(arrayProps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arrayProps]);

  return (
    <div>
      {
        arrayProps.map((_, index) => {
          return (
            <CodecParam
              key={`array-param-${index}`}
              variable={array.value}
              // eslint-disable-next-line react/jsx-no-bind
              onChange={(args) => setArrayProps((props) => props.with(index, args))}
            />
          );
        })
      }
    </div>
  );
};