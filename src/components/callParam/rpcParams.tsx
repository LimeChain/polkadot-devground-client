import { RpcParam } from './rpcParam';
import styles from './styles.module.css';

import type { IRpcCallParam } from '@constants/rpcCalls/types';

interface IRpcParams {
  params: IRpcCallParam[];
  onChange: (index: number, args: unknown) => void;
}

export const RpcParams = ({ params, onChange }: IRpcParams) => {

  return (
    <div className="flex flex-col gap-6 empty:hidden">
      {
        params.map((param, index) => (
          <div key={`rpc-param-${param.name}-${param.type}`}>
            <span className="block pb-1 font-geist font-body1-regular">
              {param.name}
            </span>
            <div className={styles['codecContainer']}>
              <div className={styles['codecGroup']}>
                <RpcParam
                  param={param}
                  placeholder={param.description}
                  readOnly={param.readOnly}
                  // eslint-disable-next-line react/jsx-no-bind
                  onChange={(args) => onChange(index, args)}
                />
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};
