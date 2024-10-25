/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/jsx-no-bind */

import { useCallback } from 'react';

import { InvocationRpcArg } from '@components/rpcCalls/invocationRpcArg';

import styles from '../invocationArgsMapper/styles.module.css';

import type { InvocationRpcArgs as Type } from '@components/invocationArgsMapper/types';

const InvocationRpcArgs = ({ rpcs, onChange }: Type) => {
  const handleOnChange = useCallback((index: number, args: unknown) => {
    onChange(index, args);
  }, []);

  return (
    <div className="flex flex-col gap-6 empty:hidden">
      {
        rpcs.map((rpc, index) => {
          const isOptional = rpc.optional;
          const {
            description,
            readOnly,
            name,
            type,
          } = rpc;

          return (
            <div key={`rpc-${index}-${name}-${type}`}>
              <span className="block pb-1 font-geist capitalize font-body1-regular">
                {
                  isOptional
                    ? `Optional<${name}>`
                    : name
                }
              </span>
              <div className={styles['invocationContainer']}>
                <div className={styles['invocationGroup']}>
                  <InvocationRpcArg
                    onChange={(args) => handleOnChange(index, args)}
                    placeholder={description}
                    readOnly={readOnly}
                    rpc={rpc}
                  />
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default InvocationRpcArgs;
