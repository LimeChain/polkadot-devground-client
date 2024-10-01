import {
  type MouseEventHandler,
  type ReactElement,
  type RefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { cn } from '@utils/helpers';

type ChipProps = {
  content: string;
  classNames?: string;
};

type TabsProps = {
  refContainer?: RefObject<HTMLDivElement>;
  children?: ReactElement | (ReactElement | null)[];
  initialTab?: number;
  className?: string;
  tabsClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
  onChange?: (index: number) => void;
  unmountOnHide?: boolean;
};

export const Tabs = (props: TabsProps) => {
  const {
    refContainer,
    children,
    initialTab = 0,
    className,
    tabsClassName,
    tabClassName,
    contentClassName,
    onChange,
    unmountOnHide = true,
  } = props;

  const [
    selectedTab,
    setSelectedTab,
  ] = useState(initialTab);

  const handleTabChange = useCallback<MouseEventHandler<HTMLDivElement>>((e) => {
    const index = Number(e.currentTarget.dataset.index);
    setSelectedTab(index);
    onChange?.(index);
  }, [onChange]);

  useEffect(() => {
    setSelectedTab(initialTab);
  }, [
    initialTab,
    children,
  ]);

  const items = Array.isArray(children) ? children : [children];

  return (
    <div
      ref={refContainer}
      className={cn(
        'flex flex-1 flex-col',
        'h-full',
        className,
      )}
    >
      <div
        className={cn(
          'relative',
          'flex items-center gap-x-4 overflow-hidden',
          'font-body2-regular',
          tabsClassName,
        )}
      >
        {
          items.map((item, index) => {
            if (!item) {
              return null;
            }

            const isActive = selectedTab === index;
            const title = item.props['data-title'];
            const isDisabled = item.props['aria-disabled'];
            const chip: ChipProps = item.props['data-chip'];

            return (
              <div
                key={index}
                data-content={title}
                data-index={index}
                onClick={handleTabChange}
                className={cn(
                  'group',
                  'cursor-pointer',
                  'relative flex items-center',
                  'px-0.5 py-1',
                  'whitespace-nowrap font-geist',
                  'transition-colors duration-300 ease-in-out',
                  'before:content[""] before:absolute before:inset-0 before:top-full',
                  'before:h-[2px] before:w-full',
                  'before:transition-colors before:duration-300 before:ease-in-out',
                  'hover:before:bg-dev-pink-500',
                  'hover:text-dev-black-1000',
                  'dark:hover:text-dev-purple-50',
                  {
                    ['dark:text-white text-dev-black-1000 before:bg-dev-pink-500']: isActive,
                    ['pointer-events-none opacity-60']: isDisabled,
                  },
                  tabClassName,
                )}
              >
                {title}
                {
                  chip?.content && (
                    <div
                      className={cn(
                        'ml-3',
                        'z-10 text-gray-400 group-hover:text-white',
                        chip.classNames,
                      )}
                    >
                      {chip.content}
                    </div>
                  )
                }
              </div>
            );
          })
        }
      </div>

      {
        unmountOnHide
          ? (
            <div
              className={cn(
                'h-full flex-1 overflow-hidden',
                contentClassName,
              )}
            >
              {items && items[selectedTab]}
            </div>
          )
          : items.map((item, index) => {
            return (
              <div
                key={index}
                className={cn(
                  'h-full flex-1 overflow-hidden',
                  'overflow-hidden',
                  {
                    'hidden': selectedTab !== index,
                  },
                  contentClassName,
                )}
              >
                {item}
              </div>
            );
          })
      }
    </div>
  );
};
