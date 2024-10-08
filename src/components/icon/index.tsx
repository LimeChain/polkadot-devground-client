import {
  type CSSProperties,
  type ForwardedRef,
  forwardRef,
} from 'react';

export interface SVGIconProps {
  size?: Array<number | string>;
  name: string;
  fill?: string;
  className?: string;
  testId?: string;
  externalURL?: string;
  style?: CSSProperties;
}

export const Icon = forwardRef(
  (props: SVGIconProps, ref: ForwardedRef<SVGSVGElement>) => {
    const {
      size = [24],
      name,
      fill,
      className,
      testId,
      externalURL = '/svg-sprite.svg',
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
        data-testid={testId}
        fill={color}
      >
        <use href={`${path}`} />
      </svg>
    );
  },
);
