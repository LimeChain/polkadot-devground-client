import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useState,
} from 'react';

import type { ICallArgs } from '.';

interface IBinaryParam extends ICallArgs {
}

export const BinaryParam = ({ onChange }: IBinaryParam) => {

  const [useFileUpload, setUseFileUpload] = useState(false);

  const handleFileUploadToggle = useCallback(() => {
    setUseFileUpload(upload => !upload);
  }, []);

  return (
    <div className="flex flex-col">
      <label >
        <span>Upload File</span>
        <input
          id="fileUpload"
          type="checkbox"
          checked={useFileUpload}
          onClick={handleFileUploadToggle}
        />
      </label>
      {
        useFileUpload
          ? <FileUploadBinaryParam onChange={onChange} />
          : <TextBinaryParam onChange={onChange} />
      }
    </div>
  );
};

export const TextBinaryParam = ({ onChange }: IBinaryParam) => {
  const [value, setValue] = useState('');

  const handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setValue(text);

    const isHex = text.startsWith('0x');
    if (isHex) {
      onChange(Binary.fromHex(text));
    } else {
      onChange(Binary.fromText(text));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <input
      type="text"
      placeholder="Binary hex or string"
      value={value}
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
