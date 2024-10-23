import { DecoderBuilder } from '@components/callArgsBuilder/decoderBuilder';

import styles from './styles.module.css';

import type { IDecoderBuilder } from '@constants/decoders/types';

interface IDecoderParams {
  params: IDecoderBuilder[];
  onChange: (index: number, args: unknown) => void;
}

export const DecoderParams = ({ params, onChange }: IDecoderParams) => {
  return (
    <div className="flex flex-col gap-6 empty:hidden">
      {
        params.map((param, index) => (
          <div key={`rpc-param-${param.name}-${param.type}`}>
            <span className="block pb-1 font-geist capitalize font-body1-regular">
              {param.name}
            </span>
            <div className={styles['codecContainer']}>
              <div className={styles['codecGroup']}>
                <DecoderBuilder
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(args) => onChange(index, args)}
                  param={param}
                  placeholder={param.description}
                />
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};
