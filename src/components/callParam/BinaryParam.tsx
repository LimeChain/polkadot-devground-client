import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

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
      <label className="flex gap-2">
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

// const defaultBinaryValue = '0x0000000000000000000000000000000000000000000000000000000000000000';
export const TextBinaryParam = ({ onChange, minLength }: IBinaryParam) => {
  const binaryMinLength = minLength * 2;
  const encodedValue = String().padEnd(binaryMinLength, '0');

  const [value, setValue] = useState(binaryMinLength ? `0x${encodedValue}` : '');
  const [isError, setIsError] = useState(false);

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);
  }, []);

  useEffect(() => {
    const isHex = value.startsWith('0x');

    const isMinLengthError = binaryMinLength ? value.length < binaryMinLength + 1 : false;
    const isMaxLengthError = binaryMinLength ? value.length > binaryMinLength + 2 : false;
    setIsError(isMinLengthError || isMaxLengthError);
    if (isHex) {
      onChange(Binary.fromHex(value));

    } else {
      onChange(Binary.fromText(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <input
      type="text"
      placeholder="Binary hex or string"
      className={cn(styles.codecInput, { ['!border-dev-red-700']: isError })}
      value={value}
      // minLength={minLength ? minLength * 2 + 2 : 0}
      required
      onChange={handleOnChange}
    />
  );
};

export const FileUploadBinaryParam = ({ onChange }: IBinaryParam) => {

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.item(0);
    if (file) {
      const buffer = await file.arrayBuffer();
      const val = Binary.fromBytes(new Uint8Array(buffer));
      onChange(val);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <input type="file" onChange={handleFileUpload} />;
};
