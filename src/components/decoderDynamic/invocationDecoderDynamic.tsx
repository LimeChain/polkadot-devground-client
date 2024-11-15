import { PrimitiveBuilder } from '@components/metadataBuilders/primitiveBuilder';

import styles from '../invocationArgsMapper/styles.module.css';

import type { InvocationDecoderDynamic as Type } from '@components/invocationArgsMapper/types';

const InvocationDecoderDynamic = ({ onChange }: Type) => {
  return (
    <div className="flex flex-col gap-6 empty:hidden">
      <div>
        <span className="block pb-1 font-geist capitalize font-body1-regular">
          SCALE-encoded value
        </span>
        <div className={styles['invocationContainer']}>
          <div className={styles['invocationGroup']}>
            <PrimitiveBuilder
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

export default InvocationDecoderDynamic;
