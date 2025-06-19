import {
  type CSSProperties,
  Suspense,
  useRef,
} from 'react';
import { Outlet } from 'react-router-dom';

import FeedbackWidget from '@components/feedbackWidget';
import { Footer } from '@components/footer';
import { Header } from '@components/header';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';
import { useResizeObserver } from '@utils/hooks/useResizeObserver';

interface ILayoutBasic {
  classNames?: string;
  hasFooter: boolean;
}

export const LayoutBasic = (props: ILayoutBasic) => {
  const {
    classNames,
    hasFooter,
  } = props;

  const refScrollArea = useRef<HTMLDivElement>(null);

  const [refContainerDimensions, , computedStyle] = useResizeObserver(refScrollArea, { withComputedStyle: true });
  const scrollAreaHeight = refContainerDimensions?.height;
  const scrollAreaWidth = refContainerDimensions?.width;

  const viewportStyles = (
    (scrollAreaHeight && computedStyle?.paddingTop && computedStyle?.paddingBottom)
    && (scrollAreaWidth && computedStyle?.paddingLeft && computedStyle?.paddingRight)
  )
    ? {
      '--initial-scroll-arrea-width': `${(scrollAreaWidth - parseInt(computedStyle?.paddingLeft) - parseInt(computedStyle?.paddingRight))}px`,
      '--initial-scroll-arrea-height': `${(scrollAreaHeight - parseInt(computedStyle?.paddingTop) - parseInt(computedStyle?.paddingBottom))}px`,
    } as CSSProperties
    : undefined;

  return (
    <Suspense>
      <div
        className="grid max-h-screen min-h-screen grid-rows-layout overflow-hidden"
        style={viewportStyles}
      >
        <Header />
        <PDScrollArea
          ref={refScrollArea}
          viewportClassNames={cn(
            'pb-8 pt-4',
            'lg:pb-16 lg:pt-8',
            'px-6 lg:px-14',
            '[&>*:first-child]:h-full',
            classNames,
          )}
        >
          {viewportStyles && <Outlet />}
        </PDScrollArea>

        {
          hasFooter && (
            <Footer />
          )
        }
      </div>
      <FeedbackWidget />
    </Suspense>
  );
};

LayoutBasic.displayName = 'LayoutBasic';
