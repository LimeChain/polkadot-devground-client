import {
  type ClassValue,
  clsx,
} from 'clsx';
import { nanoid } from 'nanoid';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const uid = (length = 8): string => {
  return nanoid(length);
};

export const formatConsoleMessage = (_key: string, value: unknown) => {
  return typeof value === 'bigint' ? value.toString() : value;
};
