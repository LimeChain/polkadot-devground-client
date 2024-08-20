import { CompatibilityLevel } from 'polkadot-api';

export const checkForProp = (prop: unknown, message: string) => {
  if (!prop) {
    throw new Error(`${message} is not defined`);
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIfCompatable = (method: { isCompatible: any }, message: string) => {
  const isCompatable = method.isCompatible(CompatibilityLevel.Partial);

  if (!isCompatable) {
    throw new Error(`${message} is not compatable`);
  }
};
