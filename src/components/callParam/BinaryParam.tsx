import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { FileUpload } from '@components/FileUpload';
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
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex w-fit gap-2">
        <span>Upload File</span>
        <input
          id="fileUpload"
          type="checkbox"
          checked={useFileUpload}
          onChange={handleFileUploadToggle}
        />
      </label>
      {
        useFileUpload
          ? <FileUploadBinaryParam onChange={onChange} minLength={minLength} />
          : <TextBinaryParam onChange={onChange} minLength={minLength} />
      }
    </div>
  );
};

export const TextBinaryParam = ({ onChange, minLength }: IBinaryParam) => {
  const requiredBinaryLength = minLength * 2;
  const encodedValue = String().padEnd(requiredBinaryLength, '0');

  const [value, setValue] = useState(requiredBinaryLength ? `0x${encodedValue}` : '');
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

      setIsError(_value.asHex().length !== requiredBinaryLength);
    } else {
      const _value = Binary.fromHex(value);
      onChange(_value);

      setIsError(_value.asHex().length !== requiredBinaryLength);
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
