import { Binary } from 'polkadot-api';
import {
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

interface IBinaryBuilder extends ICallArgs {
  minLength: number;
  placeholder?: string;
  readOnly?: boolean;
}

export const BinaryBuilder = ({
  onChange,
  minLength,
  placeholder,
  readOnly,
}: IBinaryBuilder) => {

  const [
    useFileUpload,
    setUseFileUpload,
  ] = useState(false);

  const handleFileUploadToggle = useCallback(() => {
    setUseFileUpload((upload) => !upload);
    onChange(Binary.fromText(''));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.codecGroup}>
      <PDSwitch
        checked={useFileUpload}
        onChange={handleFileUploadToggle}
        title="File Upload"
      />
      {
        useFileUpload && !readOnly
          ? <PDFileUpload onChange={onChange} />
          : (
            <TextBinaryBuilder
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

export const TextBinaryBuilder = ({
  onChange,
  minLength,
  placeholder,
  readOnly,
}: IBinaryBuilder) => {
  const requiredHexLength = minLength * 2;

  const requiredBinaryLength = minLength;
  const encodedValue = String().padEnd(requiredHexLength, '0');

  const [
    value,
    setValue,
  ] = useState(requiredHexLength ? `0x${encodedValue}` : '');
  const [
    isError,
    setIsError,
  ] = useState(false);

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
      onChange={handleOnChange}
      placeholder={placeholder || 'Binary hex or string'}
      readOnly={readOnly}
      type="text"
      value={value}
      className={cn(
        styles.codecInput,
        {
          [styles.codecInputError]: isError,
        },
      )}
    />
  );
};
