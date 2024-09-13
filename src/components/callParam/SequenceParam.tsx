import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import { BinaryParam } from './BinaryParam';
import { CodecParam } from './CodecParam';
import styles from './styles.module.css';

import { type ICallArgs } from '.';

import type { SequenceVar } from '@polkadot-api/metadata-builders';
interface ISequence extends ICallArgs {
  sequence: SequenceVar;
}

export const SequenceParam = ({ sequence, onChange }: ISequence) => {
  if (sequence.value.type === 'primitive' && sequence.value.value === 'u8') {
    return (
      <div className={styles.codecParam}>
        <BinaryParam onChange={onChange} minLength={0} />
      </div>
    );
  }

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

  const handleOnChange = useCallback((args: unknown, id: string) => {
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

  const handleRemoveItem = useCallback(() => {
    setLength((length) => length - 1);
    setParams(params => params.slice(0, -1));
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="-mb-4 flex justify-end gap-4">
          <button
            type="button"
            className={cn(
              'mb-2 flex gap-1 font-geist font-body1-bold'
              , 'text-dev-pink-500 transition-colors hover:text-dev-pink-300',
            )}
            onClick={handleAddItem}
          >
            <Icon
              name="icon-add"
              size={[24]}
            />
            Add Item
          </button>

          <button
            type="button"
            disabled={params.length === 0}
            className={cn(
              'mb-2 flex gap-1 font-geist font-body1-bold'
              , 'text-dev-pink-500 transition-colors hover:text-dev-pink-300',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-dev-pink-500',
            )}
            onClick={handleRemoveItem}
          >
            <Icon
              name="icon-remove"
              size={[24]}
            />
            Remove Item
          </button>

        </div>
        {
          params.map((param, index) => {
            const nextType = sequence.value.type;

            return (
              <div
                key={param.id}
                className="grid w-full grid-cols-[16px_1fr] gap-2"
              >
                <span className={cn(
                  'font-geist font-h5-regular',
                  {
                    ['pt-1']: nextType === 'sequence',
                    ['pt-3']: nextType === 'enum' || nextType === 'primitive',
                  },
                )}
                >
                  {index}:
                </span>
                <div className="flex w-full flex-col gap-6">
                  <CodecParam
                    variable={sequence.value}
                    // eslint-disable-next-line react/jsx-no-bind
                    onChange={args => handleOnChange(args, param.id)}
                  />
                </div>
              </div>
            );
          })
        }

      </div>
    </>
  );
};
