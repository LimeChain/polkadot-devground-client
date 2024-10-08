import * as Tooltip from '@radix-ui/react-tooltip';

import { cn } from '@utils/helpers';

interface ToolTipProps {
  text: string;
  children: React.ReactNode;
}

export const ToolTip = (props: ToolTipProps) => {
  const { text, children } = props;

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={5}
            className={cn(
              'z-[999] p-2',
              'rounded-lg',
              'font-geist font-body3-bold',
              'bg-dev-purple-700 dark:bg-white',
              'text-white dark:text-black',
              'animate-slide-up-fade',
            )}
          >
            {text}
            <Tooltip.Arrow className="fill-dev-purple-700 dark:fill-white" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
