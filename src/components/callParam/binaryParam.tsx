import { Binary } from 'polkadot-api';
import React, {
  type ChangeEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDFileUpload } from '@components/pdFileUpload';
import { PDSwitch } from '@components/pdSwitch';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

import type { ICallArgs } from './index';

interface IBinaryParam extends ICallArgs {
  minLength: number;
}

export const BinaryParam = ({ onChange, minLength }: IBinaryParam) => {

  const [useFileUpload, setUseFileUpload] = useState(false);

  const handleFileUploadToggle = useCallback(() => {
    setUseFileUpload(upload => !upload);
    onChange(Binary.fromText(''));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.codecGroup}>
      <PDSwitch
        title="File Upload"
        checked={useFileUpload}
        onChange={handleFileUploadToggle}
      />
      {
        useFileUpload
          ? <PDFileUpload onChange={onChange} />
          : <TextBinaryParam onChange={onChange} minLength={minLength} />
      }
    </div>
  );
};

const TextBinaryParam = ({ onChange, minLength }: IBinaryParam) => {
  const requiredHexLength = minLength * 2;
  const requiredBinaryLength = minLength;
  const encodedValue = String().padEnd(requiredHexLength, '0');

  const [value, setValue] = useState(requiredHexLength ? `0x${encodedValue}` : '');
  const [isError, setIsError] = useState(false);

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);
  }, []);

  useEffect(() => {
    const isHex = value.startsWith('0x');

    if (isHex) {
      const _value = Binary.fromHex(value);
      onChange(_value);

      const valueLength = _value.asBytes().length;
      setIsError(minLength ? valueLength !== requiredBinaryLength : false);
    } else {
      const _value = Binary.fromHex(value);
      onChange(_value);

      const valueLength = _value.asBytes().length;
      setIsError(minLength ? valueLength !== requiredBinaryLength : false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Binary hex or string"
      value={value}
      onChange={handleOnChange}
      className={cn(
        styles.codecInput,
        {
          [styles.codecInputError]: isError,
        },
      )}
    />
  );
};
