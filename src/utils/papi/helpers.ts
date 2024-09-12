import {
  Binary,
  FixedSizeBinary,
} from 'polkadot-api';

export function assert(prop: unknown, message: string): asserts prop {
  if (prop === null || typeof prop === 'undefined') {
    throw new Error(message);
  }
}

export const checkIfCompatable = (isCompatable: boolean, message: string) => {
  if (!isCompatable) {
    throw new Error(message);
  }
};

export function unwrapApiResult(data: unknown): unknown {
  if (data instanceof FixedSizeBinary) {
    return data.asHex();
  }

  if (data instanceof Binary) {
    return data.asHex();
  }

  if (typeof data !== 'object') {
    return data;
  }

  if (data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(unwrapApiResult);
  }

  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, unwrapApiResult(value)] as const),
  );
}
