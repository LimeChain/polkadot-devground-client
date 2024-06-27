import { busDispatch } from '@pivanov/event-bus';
import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { Button } from '@components/ui';
import { demoCodes } from '@views/codeEditor/snippets';

import type { IEventBusDemoCode } from '@custom-types/eventBus';

export const Header = () => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCode>({
      type: '@@-example-code',
      data: exampleIndex,
    });
  }, []);

  return (
    <div className="text-white] flex items-center justify-between p-4 pb-0">
      <div className="text-lg font-semibold tracking-wider">
        <Icon name="logo-polkadot" size={[132, 28]} />
      </div>
      <div className="flex gap-x-4 self-end">
        {demoCodes.map((_, index) => (
          <Button
            key={index}
            onClick={handleClick}
            data-example={index}
          >
            {`Demo ${index + 1}`}
          </Button>
        ))}
      </div>
    </div>
  );
};

Header.displayName = 'Header';
