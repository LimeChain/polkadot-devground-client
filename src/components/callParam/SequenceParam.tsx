import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { BinaryParam } from './BinaryParam';

import {
  CallParam,
  type ICallArgs,
} from '.';

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
    onChange(params.map(p => p.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // console.log(params.forEach(p => console.log(p.id, p?.value?.asText())));

  const handleOnChange = useCallback((args: unknown, index: number) => {
    setParams(params => params.with(index, {
      id: params[index].id,
      value: args as undefined,
    }));
  }, []);

  const handleAddItem = useCallback(() => {
    setLength((length) => length + 1);
    setParams(params => ([...params, { id: crypto.randomUUID(), value: undefined }]));
  }, []);

  const handleRemoveItem = useCallback((idToRemove: string) => {
    setLength((length) => length - 1);
    setParams(params => ([...params.filter(p => p.id !== idToRemove)]));
  }, []);

  return (
    <>
      <div className="flex flex-col content-start">
        {
          params.map((param, index) => {
            return (
              <>
                <div key={param.id}>
                  <CallParam
                    key={param.id}
                    param={sequence.value}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={args => handleOnChange(args, index)}
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
              </>
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
