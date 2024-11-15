/* eslint-disable react-hooks/exhaustive-deps */
import { Binary } from 'polkadot-api';
import {
  useCallback,
  useState,
} from 'react';

import { BitstreamInput } from '@components/metadataBuilders/bitstreamBuilder/bitstreamInput';
import { PDFileUpload } from '@components/pdFileUpload';
import { PDSwitch } from '@components/pdSwitch';

import styles from '../../invocationArgsMapper/styles.module.css';

import type { IBitstreamBuilder } from '@components/invocationArgsMapper/types';
const emptyBin = Binary.fromText('');
const BitstreamBuilder = ({
  onChange,
  minLength,
  placeholder,
  readOnly,
}: IBitstreamBuilder) => {
  const [
    isFile,
    setIsFile,
  ] = useState(false);

  const handleOnSwitch = useCallback(() => {
    setIsFile((prev) => !prev);
    onChange(emptyBin);
  }, []);

  const shouldUploadFile = isFile && !readOnly;

  return (
    <div className={styles.invocationGroup}>
      <PDSwitch
        checked={isFile}
        onChange={handleOnSwitch}
        title="File Upload"
      />
      {
        shouldUploadFile
          ? <PDFileUpload onChange={onChange} />
          : (
            <BitstreamInput
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

export default BitstreamBuilder;
