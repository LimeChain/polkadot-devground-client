import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { PDScrollArea } from '@components/pdScrollArea';
import { cn } from '@utils/helpers';

interface TChainDataList {
  title: string;
  link: string;
  linkText: string;
  children: React.ReactNode;
}

export const ChainDataList = ({ title, link, linkText, children }: TChainDataList) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [scrollAreaRef]);

  const scrollToTop = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }, [scrollAreaRef]);

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      setIsAtTop(scrollAreaRef.current.scrollTop === 0);
      setIsAtBottom(scrollAreaRef.current.scrollTop + scrollAreaRef.current.clientHeight === scrollAreaRef.current.scrollHeight);
    }
  };

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => {
        scrollArea.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollAreaRef]);

  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h5 className="font-h5-bold">{title}</h5>
          <PDLink
            to={link}
            className={cn(
              'font-geist font-body2-regular',
              'text-dev-pink-500 transition-colors hover:text-dev-pink-400',
            )}
          >
            {linkText}
          </PDLink>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToTop}
            disabled={isAtTop}
            className={cn(
              isAtTop ? 'text-dev-black-200' : 'cursor-pointer text-dev-pink-500',
            )}
          >
            <Icon name="icon-arrowCircle" />
          </button>
          <button
            onClick={scrollToBottom}
            disabled={isAtBottom}
            className={cn(
              isAtBottom ? 'text-dev-black-200' : 'cursor-pointer text-dev-pink-500',
            )}
          >
            <Icon name="icon-arrowCircle" className="rotate-180" />
          </button>
        </div>
      </div>

      <PDScrollArea
        ref={scrollAreaRef}
        className="h-80 lg:h-full"
        viewportClassNames="py-3"
        verticalScrollClassNames=""
      >
        {children}
      </PDScrollArea>
    </div>
  );
};
