
import { demoCodes } from "@components/codeEditor/snippets";
import { Icon } from "@components/icon";
import { Button } from "@components/ui";
import type { IEventBusDemoCode } from "@custom-types/eventBus";
import { busDispatch } from "@pivanov/event-bus";
import { useCallback } from "react";

export const Header = () => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCode>({
      type: '@@-example-code',
      data: exampleIndex,
    });
  }, []);

  return (
    <div className="flex justify-between items-center p-4 pb-0 text-white]">
      <div className="text-lg font-semibold tracking-wider">
        <Icon
          name="logo-polkadot"
          size={[132, 28]}
        />
      </div>
      <div className="self-end flex gap-x-4">
        {
          demoCodes.map((_, index) => (
            <Button key={index} onClick={handleClick} data-example={index}>{`Demo ${index + 1}`}</Button>
          ))
        }
      </div>
    </div>
  )
};

Header.displayName = 'Header';
