import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  CallParam,
  type ICallArgs,
} from '.';

import type { StructVar } from '@polkadot-api/metadata-builders';

interface IStructParam extends ICallArgs {
  struct: StructVar;
}

export function StructParam({ struct, onChange }: IStructParam) {
  const [args, setArgs] = useState(
    () =>
      Object.fromEntries(
        Object.keys(struct.value).map((key) => [key, {}] as const),
      ),
  );

  // console.log(struct);

  useEffect(() => {
    onChange(args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleOnChange = useCallback((key: string, value: unknown) => {
    setArgs(args => ({ ...args, [key]: value } as typeof args));
  }, []);

  console.log(struct.value);

  return Object.entries(struct.value).map(([key, value], index) => {
    return (
      <div key={key}>
        {key}
        <div>
          <CallParam
            name={key}
            param={value}
            // eslint-disable-next-line react/jsx-no-bind
            onChange={(args) => handleOnChange(key, args)}
          />
        </div>
      </div>
    );
  });
}
