import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';

import { ErrorBoundary } from '@components/errorBoundary';
import { GithubButton } from '@components/githubButton';
import { Tabs } from '@components/tabs';
import { useStoreUI } from '@stores';
import { cn } from '@utils/helpers';
import { useResizeObserver } from '@utils/hooks/useResizeObserver';
import { encodeCodeToBase64 } from '@utils/iframe';
import { SelectExample } from '@views/codeEditor/components/selectExample';

import { ActionButton } from './components/actionButton';
import { DebugPanel } from './components/debugPanel';
import { Iframe } from './components/iframe';
import { MonacoEditor } from './components/monacoEditor';
import { EditorActions } from './components/monacoEditor/actions';

import type {
  IEventBusMonacoEditorShowPreview,
  IEventBusMonacoEditorUpdateCode,
} from '@custom-types/eventBus';

const TypeScriptEditor = () => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refCode = useRef<string>('');
  const refTimeout = useRef<NodeJS.Timeout>();
  const refCanPreview = useRef(false);

  const [refContainerDimensions] = useResizeObserver(refContainer);
  const containerWidth = refContainerDimensions?.width;

  const [
    isLoaded,
    setIsLoaded,
  ] = useState(false);

  const theme = useStoreUI?.use?.theme?.();

  useEventBus<IEventBusMonacoEditorShowPreview>('@@-monaco-editor-show-preview', ({ data }) => {
    refCanPreview.current = data;
  });

  useEventBus('@@-monaco-editor-hide-loading', () => {
    clearTimeout(refTimeout.current);
    refTimeout.current = setTimeout(() => {
      setIsLoaded(true);
    }, 200);
  });

  useEventBus('@@-monaco-editor-show-loading', () => {
    clearTimeout(refTimeout.current);
    setIsLoaded(false);
  });

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    refCode.current = data;
  });

  const shareCode = useCallback(async () => {
    const toastId = 'copy-to-clipboard';
    toast.dismiss(toastId);

    const encodedCode = encodeCodeToBase64(refCode.current);
    const sharedUrl = `${window.location.origin}${window.location.pathname}/${encodedCode}`;

    try {
      await navigator.clipboard.writeText(sharedUrl);
      toast.success((
        <span>
          Copied
          {' '}
          <strong>URL</strong>
          {' '}
          to clipboard
        </span>
      ), { id: toastId });
    } catch (err) {
      toast.error('Oops. Something went wrong', { id: toastId });
    }
  }, []);

  return (
    <div
      ref={refContainer}
      className="max-w-screen flex h-full flex-col gap-y-4 overflow-hidden px-8 pb-4 pt-8"
    >
      <div className="relative z-10 flex flex-1">
        <PanelGroup
          autoSaveId="persistence"
          direction="horizontal"
          className={cn(
            'opacity-0',
            'transition-opacity delay-0 duration-300',
            {
              'opacity-100 duration-300 delay-100': isLoaded,
            },
          )}
        >
          <Panel
            defaultSize={50}
            id="left"
            minSize={containerWidth ? ((580 / containerWidth) * 100) : 30}
            order={1}
            className={cn(
              'relative',
              'flex flex-col gap-y-4',
            )}
          >
            <SelectExample />

            <div
              className={cn(
                'relative z-10 flex-1',
                {
                  ['border border-dev-purple-300 dark:border-dev-black-800']: theme === 'light',
                },
              )}
            >
              <EditorActions />

              <Tabs
                unmountOnHide={false}
                tabClassName={cn(
                  'px-10 py-2.5',
                )}
                tabsClassName={cn(
                  'z-10 w-full py-4 pl-16',
                  'dark:bg-dev-black-800',
                )}
              >
                <div
                  className="flex h-full"
                  data-title="Editor"

                >
                  <MonacoEditor />
                </div>
                <div
                  className="flex h-full p-4 dark:bg-dev-black-800"
                  data-title="Read me"
                >
                  Readme.md
                </div>
              </Tabs>
            </div>
          </Panel>
          <PanelResizeHandle className="group relative top-20 w-4">
            <div
              className={cn(
                'absolute left-1/2 top-0',
                'h-full w-[4px]',
                'group-hover:bg-purple-500 group-active:bg-purple-500',
                'transition-colors duration-300 ease-in-out',
                '-translate-x-1/2',
              )}
            />
          </PanelResizeHandle>
          <Panel
            defaultSize={50}
            id="right"
            minSize={30}
            order={2}
          >
            <PanelGroup
              autoSaveId="persistence"
              className="flex flex-col"
              direction="vertical"
            >
              <GithubButton />
              {
                refCanPreview.current && (
                  <>
                    <div className={cn(
                      'flex w-full items-center justify-end gap-2 bg-dev-purple-200 p-4  dark:bg-dev-black-800',
                      'border border-b-0 border-dev-purple-300 dark:border-dev-black-800',
                    )}
                    >

                      <ActionButton
                        iconName="icon-externalLink"
                        onClick={shareCode}
                      />
                      <ActionButton
                        iconName="icon-export"
                        onClick={shareCode}
                      />
                    </div>
                    <Panel
                      className="flex border border-t-0 border-dev-purple-300 dark:border-dev-black-800"
                      defaultSize={50}
                      id="right-top"
                      minSize={30}
                      order={1}
                    >
                      <div className="flex-1">
                        <div className="relative size-full bg-dev-purple-200 dark:bg-dev-black-800">
                          <Iframe />
                        </div>
                      </div>
                    </Panel>
                    <PanelResizeHandle className="group relative h-4">
                      <div
                        className={cn(
                          'absolute inset-x-0 top-1/2',
                          'h-[4px]',
                          'group-hover:bg-purple-500 group-active:bg-purple-500',
                          'transition-colors duration-300 ease-in-out',
                          '-translate-y-1/2',
                        )}
                      />
                    </PanelResizeHandle>
                  </>
                )
              }
              <Panel
                defaultSize={50}
                id="right-bottom"
                minSize={30}
                order={2}
                className={cn(
                  'relative bg-dev-purple-200 dark:bg-dev-black-800',
                  'border border-dev-purple-300 dark:border-dev-black-800',
                )}
              >
                <DebugPanel canPreview={refCanPreview.current} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center',
            'pointer-events-none opacity-0',
            'transition-opacity duration-300 ease-in-out',
            'z-100',
            {
              'opacity-100': !isLoaded,
            },
          )}
        >
          <div
            className={cn(
              'inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent',
              'opacity-50',
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default () => {
  return (
    <ErrorBoundary>
      <TypeScriptEditor />
    </ErrorBoundary>
  );
};
