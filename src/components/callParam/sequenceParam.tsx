import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import { BinaryParam } from './binaryParam';
import { CodecParam } from './codecParam';
import styles from './styles.module.css';

import { type ICallArgs } from '.';

import type { SequenceVar } from '@polkadot-api/metadata-builders';
interface ISequence extends ICallArgs {
  sequence: SequenceVar;
  placeholder?: string;

}

export const SequenceParam = ({ sequence, onChange, placeholder }: ISequence) => {
  if (sequence.value.type === 'primitive' && sequence.value.value === 'u8') {
    return (
      <div className={styles.codecParam}>
        <BinaryParam
          minLength={0}
          onChange={onChange}
          placeholder={placeholder}
        />
      </div>
    );
  }

  return (
    <_SequenceParam
      key={`sequence-param-${sequence.value.id}`}
      onChange={onChange}
      placeholder={placeholder}
      sequence={sequence}
    />
  );
};

const _SequenceParam = ({ sequence, onChange, placeholder }: ISequence) => {
  const [
    length,
    setLength,
  ] = useState<number>(1);
  const [
    params,
    setParams,
  ] = useState(Array.from({ length }).map(() => ({ id: crypto.randomUUID(), value: undefined })));

  useEffect(() => {
    const res = params.map((p) => p.value);
    onChange(res.includes(undefined) ? undefined : res);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const handleOnChange = useCallback((args: unknown, id: string) => {
    setParams((params) => {
      const item = params.find((p) => p.id === id);
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
    setParams((params) => ([
      ...params,
      { id: crypto.randomUUID(), value: undefined },
    ]));
  }, []);

  const handleRemoveItem = useCallback(() => {
    setLength((length) => length - 1);
    setParams((params) => params.slice(0, -1));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className={cn(
        "flex justify-end gap-4",
        {
          ['-mb-4 ']: length > 0
        }
      )}>
        <button
          onClick={handleAddItem}
          type="button"
          className={cn(
            'mb-2 flex gap-1 font-geist font-body1-bold'
            , 'text-dev-pink-500 transition-colors hover:text-dev-pink-300',
          )}
        >
          <Icon
            name="icon-add"
            size={[24]}
          />
          Add Item
        </button>

        <button
          disabled={params.length === 0}
          onClick={handleRemoveItem}
          type="button"
          className={cn(
            'mb-2 flex gap-1 font-geist font-body1-bold'
            , 'text-dev-pink-500 transition-colors hover:text-dev-pink-300',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:text-dev-pink-500',
          )}
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
                {index}
                :
              </span>
              <div className="flex w-full flex-col gap-6">
                <CodecParam
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(args) => handleOnChange(args, param.id)}
                  placeholder={placeholder}
                  variable={sequence.value}
                />
              </div>
            </div>
          );
        })
      }

    </div>
  );
};
