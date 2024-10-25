/* eslint-disable react-hooks/exhaustive-deps */
import { Binary } from 'polkadot-api';
import {
  useCallback,
  useState,
} from 'react';

import { BinaryInput } from '@components/metadataBuilders/binaryBuilder/binaryInput';
import { PDFileUpload } from '@components/pdFileUpload';
import { PDSwitch } from '@components/pdSwitch';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IBinaryBuilder } from '@components/invocationArgsMapper/types';

const BinaryBuilder = ({
  onChange,
  minLength,
  placeholder,
  readOnly,
}: IBinaryBuilder) => {
  const [
    useFileUpload,
    setUseFileUpload,
  ] = useState(false);

  const handleOnSwitch = useCallback(() => {
    setUseFileUpload((upload): boolean => !upload);
    onChange(Binary.fromText(''));
  }, []);

  const shouldUseFileUpload = useFileUpload && !readOnly;

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={useFileUpload}
        onChange={handleOnSwitch}
        title="File Upload"
      />
      {
        shouldUseFileUpload
          ? <PDFileUpload onChange={onChange} />
          : (
            <BinaryInput
              minLength={minLength}
              onChange={onChange}
              placeholder={placeholder}
              readOnly={readOnly}
            />
          )
      }
    </div>
  );
};

export default BinaryBuilder;
