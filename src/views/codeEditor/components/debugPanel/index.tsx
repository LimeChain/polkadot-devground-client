import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { Tabs } from '@components/ui/tabs';
import { useStoreUI } from '@stores';
import { useResizeObserver } from '@utils/hooks/useResizeObserver';
import { prettyPrintMessage } from '@views/codeEditor/helpers';

import { Iframe } from '../iframe';

import { Console } from './console';
import { ConsoleActions } from './console/consoleActions';
import { Problems } from './problems';

import type {
  IEventBusConsoleMessage,
  IEventBusErrorItem,
} from '@custom-types/eventBus';

const loadTheme = (theme: 'dark' | 'light') => {
  const id = 'prism-theme';
  let link = document.getElementById(id) as HTMLLinkElement | null;

  if (link) {
    link.remove();
  }

  link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = theme === 'dark' ? '/prismjs/css/prism-one-dark.css' : '/prismjs/css/prism-one-light.css';
  document.head.appendChild(link);
};

interface IframeProps {
  canPreview: boolean;
}
export const DebugPanel = (props: IframeProps) => {
  const { canPreview } = props;
  const refContainer = useRef<HTMLDivElement | null>(null);

  const [refContainerDimensions] = useResizeObserver(refContainer);
  const containerWidth = refContainerDimensions?.width;

  const [initialTab, setInitialTab] = useState(0);
  const [chipContent, setChipContent] = useState<number | undefined>(undefined);

  const theme = useStoreUI.use.theme?.();

  useEffect(() => {
    loadTheme(theme);
  }, [theme]);

  useEventBus<IEventBusErrorItem>('@@-problems-message', ({ data }) => {
    const content = (data.length >= 1) ? data.length : undefined;
    setChipContent(content);
  });

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'customLog') {
      const messages = [
        {
          ts: new Date().getTime(),
          message: prettyPrintMessage(event.data.args.join(' ')),
        },
      ];

      busDispatch<IEventBusConsoleMessage>({
        type: '@@-console-message',
        data: messages,
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  return (
    <Tabs
      refContainer={refContainer}
      initialTab={initialTab}
      onChange={setInitialTab}
      unmountOnHide={false}
      tabsClassName="px-2 py-0.5"
      contentClassName="relative"
    >
      <div
        data-title="Console"
        className="h-full overflow-hidden p-3 pt-2"
      >
        <Console />
        <ConsoleActions />
        {!canPreview && <Iframe classNames="hidden" />}
      </div>
      <div
        data-title="Problems"
        data-chip={{ content: chipContent }}
        className="h-full overflow-hidden p-3 pt-2"
      >
        <Problems maxWidth={containerWidth} />
      </div>
    </Tabs>
  );
};

DebugPanel.displayName = 'DebugPanel';
