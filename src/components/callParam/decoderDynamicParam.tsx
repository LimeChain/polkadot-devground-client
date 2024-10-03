import type { IDecoderParam } from '@constants/decoders/types';
import { RpcParam } from './rpcParam';
import styles from './styles.module.css';
import { DecoderParam } from '@components/callParam/decoderParam';
import { PrimitiveParam } from '@components/callParam/primitiveParam';

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
              primitive={{ value: 'str', type: 'primitive' }}
              onChange={onChange}
              placeholder='hex'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
