import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { RefObject } from 'react';

interface UseResizeObserverOptions<T extends HTMLElement = HTMLElement> {
  enableScrollListener?: boolean;
  containerRef?: HTMLElement | RefObject<T> | null | undefined;
  withComputedStyle?: boolean;
}

interface IVisibilityDetails {
  isVisible: boolean;
  top: boolean;
  middleVertical: boolean;
  bottom: boolean;
  left: boolean;
  middleHorizontal: boolean;
  right: boolean;
}

export const useResizeObserver = <T extends HTMLElement = HTMLElement>(
  ref: HTMLElement | RefObject<T> | null | undefined,
  options?: UseResizeObserverOptions<T>,
): [DOMRectReadOnly | null, visibilityDetails: IVisibilityDetails, computedStyle: CSSStyleDeclaration | null] => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly | null>(null);
  const frameId = useRef<number | null>(null);

  const [visibilityDetails, setVisibilityDetails] = useState<IVisibilityDetails>({
    isVisible: false,
    top: false,
    middleVertical: false,
    bottom: false,
    left: false,
    middleHorizontal: false,
    right: false,
  });

  const [computedStyle, setComputedStyle] = useState<CSSStyleDeclaration | null>(null);

  const { enableScrollListener, containerRef, withComputedStyle } = options || {};

  const updateDimensionsAndVisibility = useCallback(() => {
    const observeTarget = ref instanceof HTMLElement ? ref : ref?.current;
    if (!observeTarget) {
      return;
    }

    const container = containerRef instanceof HTMLElement ? containerRef : containerRef?.current;

    if (frameId.current !== null) {
      cancelAnimationFrame(frameId.current);
    }

    frameId.current = requestAnimationFrame(() => {
      const rect = observeTarget.getBoundingClientRect();

      const detail = {
        isVisible: false,
        top: false,
        middleVertical: false,
        bottom: false,
        left: false,
        middleHorizontal: false,
        right: false,
      };

      if (container) {
        const containerRect = container.getBoundingClientRect();

        // Check for horizontal visibility
        const elementCenterHorizontal = rect.left + rect.width / 2;
        detail.left = rect.left >= containerRect.left && rect.left <= containerRect.right;
        detail.middleHorizontal = elementCenterHorizontal >= containerRect.left && elementCenterHorizontal <= containerRect.right;
        detail.right = rect.right <= containerRect.right && rect.right >= containerRect.left;

        // Check for vertical visibility
        const elementCenterVertical = rect.top + rect.height / 2;
        detail.top = rect.top >= containerRect.top && rect.top <= containerRect.bottom;
        detail.middleVertical = elementCenterVertical >= containerRect.top && elementCenterVertical <= containerRect.bottom;
        detail.bottom = rect.bottom <= containerRect.bottom && rect.bottom >= containerRect.top;

        // Determine overall visibility
        detail.isVisible = detail.top || detail.middleVertical || detail.bottom;
      } else {
        // Assume visible if no container is specified
        detail.isVisible = true;
        detail.top = detail.middleVertical = detail.bottom = true;
        detail.left = detail.middleHorizontal = detail.right = true;
      }

      setDimensions(rect);
      setVisibilityDetails(detail);
      if (withComputedStyle) {
        setComputedStyle(getComputedStyle(observeTarget));
      }
    });
  }, [ref, containerRef, withComputedStyle]);

  useEffect(() => {
    const observeTarget = ref instanceof HTMLElement ? ref : ref?.current;
    if (!observeTarget) {
      return;
    }

    const resizeObserver = new ResizeObserver(updateDimensionsAndVisibility);
    resizeObserver.observe(observeTarget);

    window.addEventListener('resize', updateDimensionsAndVisibility);

    if (enableScrollListener) {
      window.addEventListener('scroll', updateDimensionsAndVisibility, true);
    }

    return () => {
      resizeObserver.unobserve(observeTarget);
      window.removeEventListener('resize', updateDimensionsAndVisibility);
      if (enableScrollListener) {
        window.removeEventListener('scroll', updateDimensionsAndVisibility, true);
      }
      if (frameId.current !== null) {
        cancelAnimationFrame(frameId.current);
      }
    };
  }, [ref, updateDimensionsAndVisibility, enableScrollListener]);

  return [dimensions, visibilityDetails, computedStyle];
};
