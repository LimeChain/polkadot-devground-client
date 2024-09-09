import React, {
  useEffect,
  useState,
} from 'react';

import { Icon } from '@components/icon';

import { smoothScroll } from '../helpers';

export const ScrollButtons = ({ scrollAreaRef, blockNumbers }) => {
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [prevScrollLeft, setPrevScrollLeft] = useState(0);

  // Scroll to the left (start) of the container
  const scrollToLeft = () => {
    if (scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, 0);
      setIsFollowing(false); // Stop following when scrolling left
    }
  };

  // Scroll to the right (end) of the container
  const scrollToRight = () => {
    if (scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, scrollAreaRef.current.scrollWidth);
      setIsFollowing(true); // Start following when scrolling right
    }
  };

  // Handle scroll events to update button states
  const handleScroll = () => {

    if (scrollAreaRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollAreaRef.current;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth === scrollWidth);
      setIsFollowing(scrollLeft + clientWidth === scrollWidth);
    }
  };

  // Add scroll event listener
  useEffect(() => {
    const currentRef = scrollAreaRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check to set correct button states
      return () => currentRef.removeEventListener('scroll', handleScroll);
    }
  }, [scrollAreaRef, prevScrollLeft]);

  // Auto-scroll to the right when new blocks are added and following
  useEffect(() => {
    if (isFollowing && scrollAreaRef.current) {
      smoothScroll(scrollAreaRef.current, scrollAreaRef.current.scrollWidth);
    }

  }, [blockNumbers, isFollowing]);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`cursor-pointer ${isAtStart ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={isAtStart ? undefined : scrollToLeft}
      >
        <Icon name="icon-arrowCircle" className="-rotate-90 text-dev-pink-500" />
      </span>
      <span
        className={`cursor-pointer ${isAtEnd ? 'cursor-not-allowed opacity-50' : ''}`}
        onClick={isAtEnd ? undefined : scrollToRight}
      >
        <Icon name="icon-arrowCircle" className="rotate-90 text-dev-pink-500" />
      </span>
    </div>
  );
};
