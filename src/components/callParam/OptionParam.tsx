import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { CodecParam } from './CodecParam';

import type { ICallArgs } from '.';
import type { OptionVar } from '@polkadot-api/metadata-builders';

interface IOptionParam extends ICallArgs {
  option: OptionVar;
}

export const OptionParam = ({ option, onChange }: IOptionParam) => {
  const [includeOption, setIncludeOption] = useState(false);
  const [value, setValue] = useState(undefined);

  const handleIncludeOptionToggle = useCallback(() => {
    setIncludeOption(include => !include);
  }, []);

  const handleOnChange = useCallback((args: unknown) => {
    setValue(args as undefined);
  }, []);

  useEffect(() => {
    onChange(includeOption ? value : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, includeOption]);

  return (
    <div className="flex flex-col gap-2">
      <label className="flex gap-2">
        <span>Include option</span>
        <input
          id="fileUpload"
          type="checkbox"
          checked={includeOption}
          onChange={handleIncludeOptionToggle}
        />
      </label>
      {
        includeOption
        && <CodecParam variable={option.value} onChange={handleOnChange} />
      }
    </div>
  );
};
