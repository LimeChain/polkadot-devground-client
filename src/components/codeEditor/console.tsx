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
        )}
        style={{ paddingTop: topPadding, paddingBottom: bottomPadding }}
      >
        {
          visibleItems.map((index) => {
            return (
              <div
                key={data[index].ts + index}
              >
                {data[index].message}
              </div>
            )
          })
        }
      </div>
    </ScrollArea>
  )
};

Console.displayName = 'Console';
