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
