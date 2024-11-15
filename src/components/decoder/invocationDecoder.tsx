/* eslint-disable react/jsx-no-bind */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback } from 'react';

import { InvocationDecoderArgs } from '@components/decoder/invocationDecoderArgs';
import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';

import styles from '../invocationArgsMapper/styles.module.css';

import type { InvocationDecoder as Type } from '@components/invocationArgsMapper/types';

const InvocationDecoder = ({ fields, onChange }: Type) => {
  const handleOnChange = useCallback((index: number, args: unknown) => {
    onChange(index, args);
  }, []);

  if (!fields) {
    return null;
  } else {
    return (
      <div className="flex flex-col gap-6 empty:hidden">
        {
          fields.map((field, index) => {
            const { name, type, description } = field;
            if (!type) {
              return <NotImplemented key={`rpc-field-not-implemented-${name}`} />;
            } else {
              return (
                <div key={`rpc-field-${name}-${type}`}>
                  <span className="block pb-1 font-geist capitalize font-body1-regular">
                    {name}
                  </span>
                  <div className={styles['invocationContainer']}>
                    <div className={styles['invocationGroup']}>
                      <InvocationDecoderArgs
                        decoder={field}
                        onChange={(args) => handleOnChange(index, args)}
                        placeholder={description}
                      />
                    </div>
                  </div>
                </div>
              );
            }
          })
        }
      </div>
    );
  }
};

export default InvocationDecoder;
