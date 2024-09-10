import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { PDSwitch } from '@components/pdSwitch';

import { CodecParam } from './CodecParam';
import styles from './styles.module.css';

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
    <div className={styles.codecGroup}>
      <PDSwitch
        title="Include Option"
        checked={includeOption}
        onChange={handleIncludeOptionToggle}
      />
      {
        includeOption
        && <CodecParam variable={option.value} onChange={handleOnChange} />
      }
    </div>
  );
};
