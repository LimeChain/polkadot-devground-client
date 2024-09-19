import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { PDLink } from '@components/pdLink';
import { cn } from '@utils/helpers';
import { smoothScroll } from '@views/forks/helpers';

import { ExtrinsicsList } from '../extrinsicsList';
import { LatestBlocksList } from '../latestBlocksList';

interface IChainDataList {
  title: string;
  urlPath: 'latest-blocks' | 'extrinsics';
}

export const ChainDataList = (props: IChainDataList) => {
  const {
    title,
    urlPath,
  } = props;

  const refScrollArea = useRef<HTMLDivElement>(null);

  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const scrollToBottom = useCallback(() => {
    if (refScrollArea.current) {
      void smoothScroll(refScrollArea.current, 'top', refScrollArea.current.scrollHeight);
    }
  }, [refScrollArea]);

  const scrollToTop = useCallback(() => {
    if (refScrollArea.current) {
      void smoothScroll(refScrollArea.current, 'top', 0);
    }
  }, [refScrollArea]);

  const handleScroll = useCallback(() => {
    if (refScrollArea.current) {
      setIsAtStart(refScrollArea.current.scrollTop === 0);
      setIsAtEnd(refScrollArea.current.scrollTop + refScrollArea.current.clientHeight === refScrollArea.current.scrollHeight);
    }
  }, []);

  useEffect(() => {
    const scrollArea = refScrollArea.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => {
        scrollArea.removeEventListener('scroll', handleScroll);
      };
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-y-3 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h5 className="font-h5-bold">{title}</h5>
          <PDLink
            to={urlPath}
            className={cn(
              'font-geist font-body2-regular',
              'text-dev-pink-500 transition-colors hover:text-dev-pink-400',
            )}
          >
            View All
          </PDLink>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollToTop}
            disabled={isAtStart}
            className={cn(
              'text-dev-black-200',
              'transition-colors duration-300',
              {
                ['cursor-pointer text-dev-pink-500']: !isAtStart,
              },
            )}
          >
            <Icon name="icon-arrowCircle" />
          </button>
          <button
            onClick={scrollToBottom}
            disabled={isAtEnd}
            className={cn(
              'text-dev-black-200',
              'transition-colors duration-300',
              {
                ['cursor-pointer text-dev-pink-500']: !isAtEnd,
              },
            )}
          >
            <Icon name="icon-arrowCircle" className="rotate-180" />
          </button>
        </div>
      </div>

      {urlPath === 'latest-blocks' && <LatestBlocksList ref={refScrollArea} />}
      {urlPath === 'extrinsics' && <ExtrinsicsList ref={refScrollArea} />}
    </div>
  );
};
