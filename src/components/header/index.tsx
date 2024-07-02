import { busDispatch } from '@pivanov/event-bus';
import { useCallback } from 'react';

import { Icon } from '@components/icon';
import { Button } from '@components/ui';
import { snippets } from '@views/codeEditor/snippets';

import type { IEventBusDemoCodeIndex } from '@custom-types/eventBus';

export const Header = () => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCodeIndex>({
      type: '@@-example-code-index',
      data: exampleIndex,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-white] flex items-center justify-between px-6 py-4">
      <div className="text-lg font-semibold tracking-wider">
        <Icon name="logo-polkadot" size={[128, 40]} />
      </div>
      <div className="flex gap-x-4 self-end">
        {snippets.map((snippet) => (
          <Button
            key={snippet.id}
            onClick={handleClick}
            data-example={snippet.id}
          >
            Demo {snippet.id}
          </Button>
        ))}
      </div>
    </div>
  );
};

Header.displayName = 'Header';
