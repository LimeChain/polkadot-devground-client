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
