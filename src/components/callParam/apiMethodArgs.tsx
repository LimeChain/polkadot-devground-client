import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';

import { CodecParam } from './codecParam';
import styles from './styles.module.css';

import type { TMetaDataApiMethod } from '@custom-types/papi';

interface IMethodArgs {
  method: TMetaDataApiMethod;
  onChange: (args: unknown) => void;
}

export const MethodArgs = ({
  method,
  onChange,
}: IMethodArgs) => {
  const lookup = useStoreChain?.use?.lookup?.();

  const inputs = method.inputs;
  const [
    args,
    setArgs,
  ] = useState(inputs.reduce((
    acc: {
      [key: string]: unknown;
    }, curr,
  ) => {
    acc[curr.name] = undefined;
    return acc;
  }, {}));

  useEffect(() => {
    onChange(args);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [args]);

  const handleOnChange = useCallback((key: string, value: unknown) => {
    setArgs((args) => ({ ...args, [key]: value } as typeof args));
  }, []);

  if (inputs.length <= 0 || !lookup) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      {
        inputs.map((type) => {
          const apiType = lookup(type.type);

          return (
            <div key={type.name}>
              <span className="block pb-1 font-geist font-body1-regular">
                {type.name}
              </span>
              <div className={cn(
                styles.codecGroup,
                styles.codecContainer,
              )}
              >
                <CodecParam
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(args) => handleOnChange(type.name, args)}
                  variable={apiType}
                />
              </div>
            </div>
          );
        })
      }
    </div>
  );

};
