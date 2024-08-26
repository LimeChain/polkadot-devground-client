import { Binary } from 'polkadot-api';
import React, {
  useCallback,
  useState,
} from 'react';

import type { ICallArgs } from '.';

interface IBinaryParam extends ICallArgs {
}

export const BinaryParam = ({ onChange }: IBinaryParam) => {
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
