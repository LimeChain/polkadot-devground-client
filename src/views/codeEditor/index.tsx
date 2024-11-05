import { useEventBus } from '@pivanov/event-bus';
import {
  useRef,
  useState,
} from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';

import { ErrorBoundary } from '@components/errorBoundary';
import { GithubButton } from '@components/githubButton';
import { MobileNotAllowed } from '@components/MobileNotAllowed';
import { Tabs } from '@components/tabs';
import { useStoreUI } from '@stores';
import { cn } from '@utils/helpers';
import { useResizeObserver } from '@utils/hooks/useResizeObserver';
import { SelectExample } from '@views/codeEditor/components/selectExample';
import { useStoreCustomExamples } from 'src/stores/examples';

import { DebugPanel } from './components/debugPanel';
import { Iframe } from './components/iframe';
import { MonacoEditor } from './components/monacoEditor';
import { EditorActions } from './components/monacoEditor/actions';

import type { IEventBusMonacoEditorShowPreview } from '@custom-types/eventBus';

const TypeScriptEditor = () => {
  const refContainer = useRef<HTMLDivElement>(null);
  const refTimeout = useRef<NodeJS.Timeout>();
  const refCanPreview = useRef(false);

  const selectedExample = useStoreCustomExamples?.use?.selectedExample() || {};
  const exampleDescription = selectedExample?.description;
  const [refContainerDimensions] = useResizeObserver(refContainer);
  const containerWidth = refContainerDimensions?.width;

  const [
    isLoaded,
    setIsLoaded,
  ] = useState(false);

  const isDesktop = useStoreUI?.use?.isDesktop?.();

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

  if (!isDesktop) {
    return <MobileNotAllowed />;
  }

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
                'relative z-10 flex-1 bg-dev-purple-200 dark:bg-dev-black-800',
              )}
            >
              <Tabs
                unmountOnHide={false}
                tabClassName={cn(
                  'px-6 py-2.5',
                )}
                tabsClassName={cn(
                  'w-full py-4 pl-8',
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
                  className="flex h-full px-9 py-4 dark:bg-dev-black-800"
                  data-title="Read me"
                >
                  {exampleDescription || 'No description'}
                </div>
              </Tabs>
              <EditorActions />
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
                    <Panel
                      className="relative flex border border-t-0 border-dev-purple-300 dark:border-dev-black-800"
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
