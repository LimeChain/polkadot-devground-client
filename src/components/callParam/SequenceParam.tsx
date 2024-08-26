import {
  Fragment,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { BinaryParam } from './BinaryParam';
import { CodecParam } from './CodecParam';

import { type ICallArgs } from '.';

import type { SequenceVar } from '@polkadot-api/metadata-builders';

interface ISequence extends ICallArgs {
  sequence: SequenceVar;
}

export const SequenceParam = ({ sequence, onChange }: ISequence) => {
  if (sequence.value.type === 'primitive' && sequence.value.value === 'u8') {
    return <BinaryParam onChange={onChange} />;
  }

  console.log('sequence', sequence);

  return (
    <_SequenceParam
      key={sequence.value.id}
      sequence={sequence}
      onChange={onChange}
    />
  );
};

const _SequenceParam = ({ sequence, onChange }: ISequence) => {
  const [length, setLength] = useState<number>(1);
  const [params, setParams] = useState(Array.from({ length }).map(() => ({ id: crypto.randomUUID(), value: undefined })));

  useEffect(() => {
    const res = params.map(p => p.value);
    onChange(res.includes(undefined) ? undefined : res);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  console.log(params);

  const handleOnChange = useCallback((args: unknown, id: string) => {
    // setParams(params => params.with(index, {
    //   id: params[index].id,
    //   value: args as undefined,
    // }));

    setParams(params => {
      const item = params.find(p => p.id === id);
      if (item) {
        const index = params.indexOf(item);
        return params.with(index, {
          id: item.id,
          value: args as undefined,
        });
      } else {
        return params;
      }
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setLength((length) => length + 1);
    setParams(params => ([...params, { id: crypto.randomUUID(), value: undefined }]));
  }, []);

  const handleRemoveItem = useCallback((idToRemove: string) => {
    setLength((length) => length - 1);
    setParams(params => params.filter(p => p.id !== idToRemove));
  }, []);

  return (
    <>
      <div className="flex flex-col content-start">
        {
          params.map((param) => {
            return (
              <Fragment key={param.id}>
                <div>
                  <CodecParam
                    variable={sequence.value}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={args => handleOnChange(args, param.id)}
                  />
                  {
                    params.length > 1
                    && (
                      <button
                        type="button"
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick={() => handleRemoveItem(param.id)}
                      >
                        remove
                      </button>
                    )
                  }
                </div>
                <br />
              </Fragment>
            );
          })
        }

        <button
          type="button"
          className="w-fit"
          onClick={handleAddItem}
        >
          add item
        </button>
      </div>
      <br />
    </>
  );
};
