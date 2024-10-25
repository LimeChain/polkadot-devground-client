import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { useStoreChain } from '@stores';

import { InvocationMapper } from './invocationMapper';

import type { InvocationArgsMapper as Type } from '@components/invocationArgsMapper/types';

export const InvocationArgsMapper = ({ invocationVar, onChange }: Type) => {
  const lookup = useStoreChain?.use?.lookup?.();

  try {
    if (!lookup) {
      return null;
    } else {
      if (!invocationVar?.type) {
        return <NotImplemented />;
      } else {
        if (invocationVar.type !== 'lookupEntry') {
          return (
            <InvocationMapper
              invokationVar={invocationVar}
              onChange={onChange}
            />
          );
        } else {
          return (
            <InvocationMapper
              invokationVar={lookup(invocationVar.value.id)}
              onChange={onChange}
            />
          );
        }
      }
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};
