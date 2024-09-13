import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';

import { smoothScroll } from '../helpers';

interface IScrollButtons {
  scrollAreaRef: React.RefObject<HTMLDivElement>;
  blockNumbers: number[];
}

export const ScrollButtons = ({ scrollAreaRef, blockNumbers } : IScrollButtons) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const lastBlockNumberRef = useRef([]);

  const scrollToLeft = useCallback(() => {
    if (scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, 0).catch(console.error);
    }
  }, [scrollAreaRef]);

  const scrollToRight = useCallback(() => {
    if (scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, scrollAreaRef.current.scrollWidth).catch(console.error);
    }
  }, [scrollAreaRef]);

  useEffect(() => {
    if (blockNumbers.length > lastBlockNumberRef.current.length && isAtEnd) {
      scrollToRight();
    }
    lastBlockNumberRef.current = blockNumbers;
  }, [blockNumbers, isAtEnd, scrollToRight]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const currentScrollLeft = scrollAreaRef.current.scrollLeft;
        setIsAtStart(currentScrollLeft === 0);
        setIsAtEnd(currentScrollLeft + scrollAreaRef.current.clientWidth >= scrollAreaRef.current.scrollWidth);
      }
    };

    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollAreaRef]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={scrollToLeft}
        disabled={isAtStart}
        className={cn(
          isAtStart ? 'text-dev-black-200' : 'cursor-pointer text-dev-pink-500',
        )}
      >
        <Icon name="icon-arrowCircle" className="-rotate-90" />
      </button>
      <button
        onClick={scrollToRight}
        disabled={isAtEnd}
        className={cn(
          isAtEnd ? 'text-dev-black-200' : 'cursor-pointer text-dev-pink-500',
        )}
      >
        <Icon name="icon-arrowCircle" className="rotate-90" />
      </button>
    </div>
  );
};
