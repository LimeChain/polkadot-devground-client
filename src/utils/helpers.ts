import {
  type ClassValue,
  clsx,
} from 'clsx';
import { twMerge } from 'tailwind-merge';
import { nanoid } from 'nanoid';

export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};

export const uid = (length = 8): string => {
  return nanoid(length);
}
