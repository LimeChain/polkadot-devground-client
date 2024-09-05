import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { FileUpload } from '@components/FileUpload';
import { Switch } from '@components/Switch';
import { cn } from '@utils/helpers';

import styles from './styles.module.css';

import type { ICallArgs } from '.';

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
      <Switch
        title="File Upload"
        checked={useFileUpload}
        onChange={handleFileUploadToggle}
      />
      {
        useFileUpload
          ? <FileUploadBinaryParam onChange={onChange} minLength={minLength} />
          : <TextBinaryParam onChange={onChange} minLength={minLength} />
      }
    </div>
  );
};

export const TextBinaryParam = ({ onChange, minLength }: IBinaryParam) => {
  const requiredHexLength = minLength * 2;
  const requiredBinaryLength = minLength;
  const encodedValue = String().padEnd(requiredHexLength, '0');

  const [value, setValue] = useState(requiredHexLength ? `0x${encodedValue}` : '');
  const [isError, setIsError] = useState(false);

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
        { [styles.codecInputError]: isError },
      )}
    />
  );
};

export const FileUploadBinaryParam = ({ onChange }: IBinaryParam) => {
  return <FileUpload onChange={onChange} />;
};
