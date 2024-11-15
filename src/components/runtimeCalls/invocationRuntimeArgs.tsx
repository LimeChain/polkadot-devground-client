/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { InvocationMapper } from '@components/invocationArgsMapper/invocationMapper';
import { useStoreChain } from '@stores';
import { cn } from '@utils/helpers';
import { initRuntimeParams } from '@utils/invocationMapper';

import styles from '../invocationArgsMapper/styles.module.css';

import type { InvocationRuntimeArgs as Type } from '@components/invocationArgsMapper/types';

const InvocationRuntimeArgs = ({
  runtimeMethod,
  onChange,
}: Type) => {
  const lookup = useStoreChain?.use?.lookup?.();
  const { inputs } = runtimeMethod;

  const [
    runtimeParams,
    setRuntimeParams,
  ] = useState(initRuntimeParams(inputs));

  useEffect(() => {
    onChange(runtimeParams);
  }, []);

  const handleOnChange = useCallback((key: string, value: unknown) => {
    setRuntimeParams((params) => {
      const newParams = Object.assign(
        { ...params },
        { [key]: value },
      );

      onChange(newParams);
      return newParams;
    });
  }, []);

  if (!Boolean(inputs.length) || !lookup) {
    return null;
  } else {
    return (
      <div className="flex flex-col gap-6">
        {
          inputs.map((arg) => {
            const runtimeLookup = lookup(arg.type);
            return (
              <div key={`runtime-arg-${arg.name}`}>
                <span className="block pb-1 font-geist font-body1-regular">
                  {arg.name}
                </span>
                <div className={cn(
                  styles.invocationGroup,
                  styles.invocationContainer,
                )}
                >
                  <InvocationMapper
                    invokationVar={runtimeLookup}
                    onChange={(args) => handleOnChange(arg.name, args)}
                  />
                </div>
              </div>
            );
          })
        }
      </div>
    );
  }

};

export default InvocationRuntimeArgs;
