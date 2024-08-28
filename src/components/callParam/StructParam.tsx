import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { CodecParam } from './CodecParam';

import { type ICallArgs } from '.';

import type { StructVar } from '@polkadot-api/metadata-builders';

interface IStructParam extends ICallArgs {
  struct: StructVar;
}

export function StructParam({ struct, onChange }: IStructParam) {
  const [args, setArgs] = useState(
    () =>
      Object.fromEntries(
        Object.keys(struct.value).map((key) => [key, undefined] as const),
      ),
  );

  useEffect(() => {
    onChange(args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleOnChange = useCallback((key: string, value: unknown) => {
    setArgs(args => ({ ...args, [key]: value } as typeof args));
  }, []);

  return Object.entries(struct.value).map(([key, value]) => {
    return (
      <div key={key}>
        {key}
        <div className="border-l pl-4 pt-2">
          <CodecParam
            variable={value}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(args) => handleOnChange(key, args)}
          />
        </div>
      </div>
    );
  });
}