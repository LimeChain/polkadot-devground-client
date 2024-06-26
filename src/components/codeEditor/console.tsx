import { format } from 'date-fns';
import { ScrollArea } from "@components/scrollArea";
import type { IConsoleMessage } from "@custom-types/global";
import { cn } from "@utils/helpers";
import { useVirtualScroll } from "@utils/hooks/useVirtualScroll";
import { useRef } from "react";

interface IConsoleProps {
  data: IConsoleMessage[];
}

export const Console = (props: IConsoleProps) => {
  const { data } = props;

  const refContainer = useRef<HTMLDivElement | null>(null);

  const { visibleItems, topPadding, bottomPadding, handleScroll } = useVirtualScroll({
    totalItems: data.length,
    itemHeight: 20,
    containerHeight: refContainer.current?.clientHeight,
  });

  return (
    <ScrollArea
      type="auto"
      onScroll={handleScroll}
    >
      <div
        ref={refContainer}
        className={cn(
          'flex-1 flex flex-col overflow-scroll text-sm font-mono text-white text-opacity-60',
          'whitespace-nowrap'
        )}
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      >
        {
          visibleItems.map((index) => {
            return (
              <div
                key={data[index].ts + index}
                className='relative pt-5 pointer-events-none'
              >
                <div className='absolute top-0 left-0 text-[9px] text-gray-500'>{format(new Date(data[index].ts), 'yyyy-MM-dd HH:mm:ss')}</div>
                <div>{data[index].message}</div>
              </div>
            )
          })
        }
      </div>
    </ScrollArea>
  )
};

Console.displayName = 'Console';
