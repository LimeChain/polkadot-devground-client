/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { InvocationMapper } from '@components/invocationArgsMapper/invocationMapper';
import { cn } from '@utils/helpers';
import { buildSequenceState } from '@utils/invocationMapper';

import type { ISequenceBuilder } from '@components/invocationArgsMapper/types';

const STARTING_SEQUENCE_LENGTH = 1;

export const OrderBuilderCore = ({ sequence, onChange, placeholder }: ISequenceBuilder) => {
  const [
    sequenceLength,
    setSequenceLength,
  ] = useState<number>(STARTING_SEQUENCE_LENGTH);
  const [
    sequenceState,
    setSequenceState,
  ] = useState(buildSequenceState(sequenceLength));

  useEffect(() => {
    const res = sequenceState.map((p) => p.value);
    onChange(res.includes(undefined) ? undefined : res);
  }, [sequenceState]);

  const handleOnChange = useCallback((args: unknown, id: string) => {
    setSequenceState((state) => {
      const item = state.find((p) => p.id === id);
      if (!item) {
        return state;
      } else {
        const index = state.indexOf(item);
        const newParams = [...state];
        newParams[index].value = args as undefined;
        return newParams;
      }
    });
  }, []);

  const handleAddItem = useCallback(() => {
    setSequenceLength((length) => length + 1);
    setSequenceState((state) => ([
      ...state,
      { id: crypto.randomUUID(), value: undefined },
    ]));
  }, []);

  const handleRemoveItem = useCallback(() => {
    setSequenceLength((length) => length - 1);
    setSequenceState((params) => params.slice(0, -1));
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
          disabled={sequenceState.length === 0}
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
        sequenceState.map((state, index) => {
          const nextType = sequence.value.type;

          return (
            <div
              key={state.id}
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
                  onChange={(args) => handleOnChange(args, state.id)}
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
