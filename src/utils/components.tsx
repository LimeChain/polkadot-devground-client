import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ElementType,
  forwardRef,
  type ForwardRefRenderFunction,
  type WeakValidationMap,
} from 'react';

type As<Props = object> = ElementType<Props>;

type PropsOf<T extends As> = ComponentPropsWithoutRef<T> & {
  as?: As;
  testId?: string;
};

type OmitCommonProps<
  Target,
  OmitAdditionalProps extends keyof never = never,
> = Omit<Target, 'as' | OmitAdditionalProps>;

type RightJoinProps<
  SourceProps extends object = object,
  OverrideProps extends object = object,
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

type MergeWithAs<
  ComponentProps extends object,
  AsProps extends object,
  AdditionalProps extends object = object,
  AsComponent extends As = As,
> = RightJoinProps<ComponentProps, AdditionalProps> &
RightJoinProps<AsProps, AdditionalProps> & {
  as?: AsComponent;
};

type PolymorphicComponent<C extends As, Props extends object = object> = {
  <AsComponent extends As = C>(
    props: MergeWithAs<
      ComponentProps<C>,
      ComponentProps<AsComponent>,
      Props,
      AsComponent
    >,
  ): JSX.Element;

  displayName?: string;
  propTypes?: WeakValidationMap<object>;
  defaultProps?: Partial<object>;
};

export const polymorphicComponent = <
  C extends As,
  Props extends object = object,
>(
  render: ForwardRefRenderFunction<
    unknown,
  RightJoinProps<PropsOf<C>, Props> & {
    as?: As;
  }
  >,
) => {
  return forwardRef(render) as unknown as PolymorphicComponent<C, Props>;
};
