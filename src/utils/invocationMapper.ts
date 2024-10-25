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

export const buildArrayState = (length: number) => {
  return Array.from({ length }).fill(undefined);
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
  switch (v.value) {
    case 'bool':
      return Boolean(value);
    case 'char':
    case 'str':
      return value;
    case 'u8':
    case 'i8':
    case 'u16':
    case 'i16':
    case 'u32':
    case 'i32':
      return Number(value);
    case 'u64':
    case 'i64':
    case 'u128':
    case 'i128':
    case 'u256':
    case 'i256':
      return BigInt(Number(value).toFixed(0));
  }
};
