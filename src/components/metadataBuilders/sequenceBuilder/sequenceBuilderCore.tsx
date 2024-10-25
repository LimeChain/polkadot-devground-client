/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { InvocationMapper } from '@components/invocationArgsMapper/invocationMapper';
import { cn } from '@utils/helpers';

import type { ISequenceBuilder } from '@components/invocationArgsMapper/types';

export const SequenceBuilderCore = ({ sequence, onChange, placeholder }: ISequenceBuilder) => {
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
  }, [params]);

  const handleOnChange = useCallback((args: unknown, id: string) => {
    setParams((params) => {
      const item = params.find((p) => p.id === id);
      if (item) {
        const index = params.indexOf(item);
        const newParams = [...params];
        newParams[index].value = args as undefined;
        return newParams;
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
        'flex justify-end gap-4',
        {
          ['-mb-4 ']: length > 0,
        },
      )}
      >
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
                <InvocationMapper
                  invokationVar={sequence.value}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(args) => handleOnChange(args, param.id)}
                  placeholder={placeholder}
                />
              </div>
            </div>
          );
        })
      }

    </div>
  );
};
