import type { StructArgs } from '@components/invocationArgsMapper/types';
import type { TMetaDataApiMethod } from '@custom-types/papi';
import type {
  PrimitiveVar,
  StructVar,
} from '@polkadot-api/metadata-builders';

export const initRuntimeParams = (inputs: TMetaDataApiMethod['inputs']) => {
  return inputs.reduce((acc: { [key: string]: unknown }, curr): { [key: string]: unknown } => {
    acc[curr.name] = undefined;
    return acc;
  }, {});
};

export const buildArrayState = <T = undefined>(
  length: number,
  initialValue?: T,
): T[] => {
  if (length < 0) return [];
  if (length === 0) return [];

  return Array.from({ length }, () => initialValue as T);
};

export const buildSequenceState = (length: number) => {
  return Array.from({ length }).map(() => ({ id: crypto.randomUUID(), value: undefined }));
};

export const buildStructState = (struct: StructVar) => {
  return Object
    .keys(struct.value)
    .reduce((acc: { [key: StructArgs['key']]: StructArgs['value'] }, key) => {
      acc[key] = undefined;
      return acc;
    }, {});
};

export const handlePrimitiveInputChange = (v: PrimitiveVar, value: string) => {
  const primitiveHandlers: Record<string, (value: string) => boolean | string | number | bigint | undefined> = {
    bool: (value) => Boolean(value),
    char: (value) => value,
    str: (value) => value,
    u8: (value) => Number(value),
    i8: (value) => Number(value),
    u16: (value) => Number(value),
    i16: (value) => Number(value),
    u32: (value) => Number(value),
    i32: (value) => Number(value),
    u64: (value) => BigInt(Number(value).toFixed(0)),
    i64: (value) => BigInt(Number(value).toFixed(0)),
    u128: (value) => BigInt(Number(value).toFixed(0)),
    i128: (value) => BigInt(Number(value).toFixed(0)),
    u256: (value) => BigInt(Number(value).toFixed(0)),
    i256: (value) => BigInt(Number(value).toFixed(0)),
  };

  const handler = primitiveHandlers[v.value];
  return handler ? handler(value) : undefined;
};

export const getCompactValue = (isBig: boolean, value: string) => {
  return isBig ? BigInt(Number(value).toFixed(0)) : Number(value);
};
