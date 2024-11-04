import { InvocationRpcSelect } from '@components/invocationArgsMapper/invocationRpcSelect';
import { NotImplemented } from '@components/invocationArgsMapper/notImplemented';
import { OrderBuilder } from '@components/metadataBuilders/orderBuilder';
import { PrimitiveBuilder } from '@components/metadataBuilders/primitiveBuilder';

import type { InvocationRpcArg as Type } from '@components/invocationArgsMapper/types';
import type { TRpcCall } from '@constants/rpcCalls/types';

const mapperCore: Record<TRpcCall, (props: Type) => JSX.Element> = {
  string: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: 'str', type: 'primitive' }}
    />
  ),
  boolean: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: 'bool', type: 'primitive' }}
    />
  ),
  select: (props) => <InvocationRpcSelect {...props} />,
  hex: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: 'str', type: 'primitive' }}
    />
  ),
  array: (props) => (
    <OrderBuilder
      {...props}
      sequence={{
        type: 'sequence',
        value: {
          type: 'primitive',
          value: 'str',
          id: 1, /* hardcoding it does not cause a problem */
        },
      }}
    />
  ),
  number: (props) => (
    <PrimitiveBuilder
      {...props}
      primitive={{ value: props.rpc.primitiveType || 'u64', type: 'primitive' }}
    />
  ),
};

export const InvocationRpcArg = (props: Type) => {
  const { rpc } = props;
  const type = rpc.type;

  if (!type) {
    return null;
  }

  try {
    const mapType = mapperCore[type];
    if (!mapType) {
      return <NotImplemented />;
    } else {
      const InvocationComponent = mapperCore[type] ?? NotImplemented;
      return <InvocationComponent {...props} />;
    }
  } catch (error) {
    console.error(error);
    return <NotImplemented />;
  }
};
