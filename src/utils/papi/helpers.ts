import {
  Binary,
  FixedSizeBinary,
} from 'polkadot-api';

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

export function unwrapApiResult(data: unknown): unknown {
  // instanceof Binary doesn't catch Binaries returned from rpc calls
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
