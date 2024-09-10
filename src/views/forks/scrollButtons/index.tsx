import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';

import { smoothScroll } from '../helpers';

export const ScrollButtons = ({ scrollAreaRef, blockNumbers }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const lastBlockNumberRef = useRef([]);

  const scrollToLeft = useCallback(() => {
    if (scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, 0).catch(console.error);
    }
  }, [scrollAreaRef]);

  const scrollToRight = useCallback(() => {
    console.log('scrollToRight');
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
        setIsAtEnd(
          currentScrollLeft + scrollAreaRef.current.clientWidth
          >= scrollAreaRef.current.scrollWidth,
        );
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
        className={`cursor-pointer ${isAtStart ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={scrollToLeft}
        disabled={isAtStart}
      >
        <Icon name="icon-arrowCircle" className="-rotate-90 text-dev-pink-500" />
      </button>
      <button
        className={`cursor-pointer ${isAtEnd ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={scrollToRight}
        disabled={isAtEnd}
      >
        <Icon name="icon-arrowCircle" className="rotate-90 text-dev-pink-500" />
      </button>
    </div>
  );
};
