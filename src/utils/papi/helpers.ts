import {
  Binary,
  FixedSizeBinary,
} from 'polkadot-api';

import type { Var } from '@polkadot-api/metadata-builders';

type AssertFunction = (condition: unknown, message: string) => asserts condition;
export const assert: AssertFunction = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

export const checkIfCompatable = (isCompatable: boolean, message: string) => {
  if (!isCompatable) {
    throw new Error(message);
  }
};

export const varIsBinary = (variabel: Var) => {
  switch (variabel.type) {
    case 'tuple':
      return variabel.value.every((lookupEntry) =>
        lookupEntry.type === 'primitive' && lookupEntry.value === 'u8');
    default:
      return;
  }
};

export const unwrapApiResult = (data: unknown): unknown => {
  // for rpc calls
  if (data && typeof data === 'object' && 'asHex' in data) {
    return (data as Binary).asHex();
  }

  if (data instanceof Binary) {
    return data.asHex();
  }

  if (data instanceof FixedSizeBinary) {
    return data.asHex();
  }

  // AuthorityDiscoveryApi_authorities
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
    Object.entries(data).map(([
      key,
      value,
    ]) => [
      key,
      unwrapApiResult(value),
    ] as const),
  );
};
