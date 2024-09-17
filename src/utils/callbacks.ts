import type {
  FocusEvent,
  KeyboardEvent,
  WheelEvent,
} from 'react';
export const stopPropagationOnEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    e.stopPropagation();
  }
};

export const preventDefault = (e: React.MouseEvent | FocusEvent | KeyboardEvent) => {
  e.preventDefault();
};

export const onWheelPreventDefault = (e: WheelEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
};

export const stopPropagation = (e: React.MouseEvent | FocusEvent | KeyboardEvent) => {
  e.stopPropagation();
};

export const preventDefaultAndStopPropagation = (e: React.MouseEvent | FocusEvent | KeyboardEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

export const returnTrue = () => true;

export const returnFalse = () => false;

export const returnVoid = () => {};
