import {
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

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleScroll = () => {
    if (scrollAreaRef.current) {
      setIsAtTop(scrollAreaRef.current.scrollTop === 0);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <span className={`cursor-pointer ${isAtTop ? 'cursor-not-allowed opacity-50' : ''}`} onClick={!isAtTop ? scrollToTop : undefined}>
            <Icon name="icon-arrowCircle" className="text-dev-pink-500" />
          </span>
          <span className="cursor-pointer" onClick={scrollToBottom}>
            <Icon name="icon-arrowCircle" className="rotate-180 text-dev-pink-500" />
          </span>
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
