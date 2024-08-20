import { CompatibilityLevel } from 'polkadot-api';

export const checkForProp = (prop: any, message: string) => {
  if (!prop) {
    throw new Error(`${message} is not defined`);
  }
};

export const checkIfCompatable = (method: { isCompatible: any }, message: string) => {
  const isCompatable = method.isCompatible(CompatibilityLevel.Partial);

  if (!isCompatable) {
    throw new Error(`${message} is not compatable`);
  }
};
