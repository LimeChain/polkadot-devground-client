import { PrimitiveParam } from '@components/callArgsBuilder/primitiveParam';

import styles from './styles.module.css';

interface IDecoderDynamicParams {
  onChange: (args: unknown) => void;
}

export const DecoderDynamicParams = ({ onChange }: IDecoderDynamicParams) => {
  return (
    <div className="flex flex-col gap-6 empty:hidden">
      <div>
        <span className="block pb-1 font-geist capitalize font-body1-regular">
          SCALE-encoded value
        </span>
        <div className={styles['codecContainer']}>
          <div className={styles['codecGroup']}>
            <PrimitiveParam
              onChange={onChange}
              placeholder="hex"
              primitive={{ value: 'str', type: 'primitive' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
