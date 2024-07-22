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
import { cn } from '@utils/helpers';
import {
  encodeCodeToBase64,
  generateHTML,
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';

import { DebugPanel } from './components/debugPanel';
import { Iframe } from './components/iframe';
import { MonacoEditor } from './components/monacoEditor';
import { EditorActions } from './components/monacoEditor/actions';
import { SnippetsSwitcher } from './components/snippetsSwitcher';
import { defaultImportMap } from './constants';

import type {
  IEventBusMonacoEditorShowPreview,
  IEventBusMonacoEditorUpdateCode,
} from '@custom-types/eventBus';

const TypeScriptEditor = () => {
  const refCode = useRef<string>('');
  const refTimeout = useRef<NodeJS.Timeout>();
  const refCanPreview = useRef(false);
  const [isLoaded, setIsLoaded] = useState(false);

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

    const res = mergeImportMap(getImportMap(refCode.current), defaultImportMap);
    const importMap = JSON.stringify(res, null, 2);

    const html = generateHTML(refCode.current, importMap);

    const encodedCode = encodeCodeToBase64(html);
    const sharedUrl = `${window.location.origin}${window.location.pathname}/${encodedCode}`;

    try {
      await navigator.clipboard.writeText(sharedUrl);
      toast.success(<span>Copied <strong>URL</strong> to clipboard</span>, { id: toastId });
    } catch (err) {
      toast.error('Oops. Something went wrong', { id: toastId });
    }
  }, []);

  return (
    <div className="max-w-screen flex h-full flex-col overflow-hidden">
      <SnippetsSwitcher />
      <div className="relative flex flex-1 px-4 pb-4">
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
            id="left"
            order={1}
            defaultSize={50}
            minSize={30}
            className="flex flex-col gap-y-4"
          >
            <EditorActions />
            <MonacoEditor />
          </Panel>
          <PanelResizeHandle className="group relative w-4">
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
            id="right"
            order={2}
            defaultSize={50}
            minSize={30}
          >
            <PanelGroup direction="vertical" autoSaveId="persistence">
              {
                refCanPreview.current && (
                  <>
                    <div className="flex h-10 w-full items-center justify-start bg-white px-3 dark:bg-[#282c34]">
                      <div className="flex items-center justify-start space-x-1.5">
                        <span className="size-3 rounded-full bg-red-400" />
                        <span className="size-3 rounded-full bg-yellow-400" />
                        <span className="size-3 rounded-full bg-green-400" />
                      </div>
                      <button
                        type="button"
                        className="ml-auto text-xs"
                        onClick={shareCode}
                      >
                        Share Url
                      </button>
                    </div>
                    <Panel
                      id="right-top"
                      order={1}
                      defaultSize={50}
                      minSize={30}
                      className="flex"
                    >
                      <div className="flex-1">
                        <div className="relative size-full border-t-0 bg-white dark:bg-[#282c34]">
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
                id="right-bottom"
                order={2}
                defaultSize={50}
                minSize={30}
                className="relative bg-white dark:bg-[#282c34]"
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
