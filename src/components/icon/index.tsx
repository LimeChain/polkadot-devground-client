import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
} from 'react';

interface SVGIconProps {
  size?: Array<number | string>;
  name: string;
  fill?: string;
  className?: string;
  testId?: string;
  externalURL?: string;
  style?: CSSProperties;
}

export const Icon = forwardRef((props: SVGIconProps, ref: ForwardedRef<SVGSVGElement>) => {
  const {
    size,
    name,
    fill,
    className,
    testId,
    externalURL = '',
    style,
  } = props;

  const attributes = {
    width: size?.[0] || '100%',
    height: size?.[1] || size?.[0] || '100%',
    className,
    style,
  };

  const color = fill || 'currentColor';
  const path = `${externalURL}#${name}`;

  return (
    <svg
      ref={ref}
      {...attributes}
      fill={color}
      data-testid={testId}
    >
      <use href={`${path}`} />
    </svg>
  );
});
