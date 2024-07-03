import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import * as papiDescriptors from '@polkadot-api/descriptors';
import { shikiToMonaco } from '@shikijs/monaco/index.mjs';
import * as monaco from 'monaco-editor';
import { format } from 'prettier';
// eslint-disable-next-line import/default
import prettierPluginEstree from 'prettier/plugins/estree';
import parserTypeScript from 'prettier/plugins/typescript';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from 'react-resizable-panels';
import { getSingletonHighlighter } from 'shiki/index.mjs';

import { Icon } from '@components/icon';
import { Button } from '@components/ui';
import {
  cn,
  getSearchParam,
  setSearchParam,
} from '@utils/helpers';
import {
  storageExists,
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import { Console } from './console';
import {
  STORAGE_CACHE_NAME,
  STORAGE_PREFIX,
} from './constants';
import {
  prettyPrintMessage,
  setupAta,
} from './helpers';
import { Iframe } from './iframe';
import { monacoEditorConfig } from './monaco-editor-config';
import { snippets } from './snippets';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
  IEventBusDemoCode,
  IEventBusDemoCodeIndex,
  IEventBusIframeDestroy,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

const fetchType = setupAta(
  (code, path) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
  },
);

const TypeScriptEditor = () => {
  const refTimeout = useRef<NodeJS.Timeout>();
  const refExampleIndex = useRef<number>(1);
  const refEditor = useRef<HTMLDivElement | null>(null);
  const refMonacoEditor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const refCode = useRef<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refEditor.current) {
      void (async () => {
        const highlighter = await getSingletonHighlighter({
          themes: ['one-dark-pro', 'catppuccin-latte'],
          langs: ['tsx', 'typescript', 'json'],
        });
        shikiToMonaco(highlighter, monaco);
      })();

      // disable CSS validation
      monaco.languages.css.cssDefaults.setOptions({ validate: false });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: true,
        noSyntaxValidation: true,
      });

      refMonacoEditor.current = monaco.editor.create(refEditor.current, {
        ...monacoEditorConfig,
        value: refCode.current,
        language: 'typescript',
        theme: 'one-dark-pro',
        automaticLayout: true,
        folding: true,
      });

      const compilerOptions = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        allowSyntheticDefaultImports: true,
        allowUmdGlobalAccess: true,
        esModuleInterop: true,
        jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
        module: monaco.languages.typescript.ModuleKind.CommonJS,
        lib: ['esnext', 'dom'],
        typeRoots: ['node_modules/@types'],
        skipLibCheck: true,
        resolveJsonModule: true,
        target: monaco.languages.typescript.ScriptTarget.Latest,
        allowNonTsExtensions: true,
        noEmit: true,
        strict: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,

        reactNamespace: 'React',
        allowJs: true,
      };

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);

      monaco.languages.typescript.typescriptDefaults.addExtraLib(`
        declare const papiDescriptors = ${JSON.stringify(papiDescriptors)};
      `, 'papiDescriptors.d.ts');

      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        '<<react-definition-file>>',
        'file:///node_modules/@react/types/index.d.ts',
      );

      refMonacoEditor.current?.onDidChangeModelContent(() => {
        clearTimeout(refTimeout.current);
        refCode.current = refMonacoEditor.current?.getValue() || '';

        void storageSetItem(
          STORAGE_CACHE_NAME,
          `${STORAGE_PREFIX}-${refExampleIndex.current}`,
          refCode.current,
        );

        refTimeout.current = setTimeout(() => {
          void fetchType(refCode.current);
        }, 400);
      });
    }

    return () => {
      clearTimeout(refTimeout.current);
      refMonacoEditor.current?.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSnippet = useCallback(async (codeSnippetIndex: number) => {
    clearTimeout(refTimeout.current);
    // destroyIframe();

    setIsLoading(true);

    busDispatch<IEventBusConsoleMessageReset>({
      type: '@@-console-message-reset',
    });

    const selectedCodeSnippet = snippets.find(f => f.id === codeSnippetIndex) || snippets[0];

    refExampleIndex.current = selectedCodeSnippet.id;

    const isTempVersionExist = await storageExists(
      STORAGE_CACHE_NAME,
      `${STORAGE_PREFIX}-${codeSnippetIndex}`,
    );
    let code = selectedCodeSnippet.code;

    if (isTempVersionExist) {
      const existingCode = await storageGetItem<string>(
        STORAGE_CACHE_NAME,
        `${STORAGE_PREFIX}-${codeSnippetIndex}`,
      );
      code = existingCode || code;
    }
    const formattedCodeSnippet = await format(code, {
      parser: 'typescript',
      plugins: [parserTypeScript, prettierPluginEstree],
      semi: true,
      singleQuote: false,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'always',
    });

    refCode.current = formattedCodeSnippet;

    setSearchParam('s', codeSnippetIndex);

    refTimeout.current = setTimeout(async () => {
      refMonacoEditor.current?.setValue(refCode.current);
      refMonacoEditor.current?.trigger(null, 'editor.fold', {
        selectionLines: [2],
      });

      refTimeout.current = setTimeout(async () => {
        setIsLoading(false);
      }, 400);
    }, 200);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const snippetIndex = getSearchParam('s') || 1;
    void loadSnippet(Number(snippetIndex));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEventBus<IEventBusDemoCodeIndex>('@@-example-code-index', ({ data }) => {
    void loadSnippet(data);
  });

  const handleRun = useCallback(async () => {
    clearTimeout(refTimeout.current);
    busDispatch<IEventBusDemoCode>({
      type: '@@-example-code',
      data: refCode.current,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = useCallback(() => {
    busDispatch<IEventBusConsoleMessageReset>({
      type: '@@-console-message-reset',
    });
  }, []);

  const handleStop = useCallback(() => {
    busDispatch<IEventBusIframeDestroy>({
      type: '@@-iframe-destroy',
    });

    window.location.reload();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReloadSnipped = useCallback(() => {
    void storageRemoveItem(STORAGE_CACHE_NAME, `${STORAGE_PREFIX}-${refExampleIndex.current}`);
    window.location.reload();
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'customLog') {
      const messages: IConsoleMessage[] = [{
        ts: new Date().getTime(),
        message: prettyPrintMessage(event.data.args.join(' ')),
      }];

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

  const canPreview = refCode.current.includes('createRoot');

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCodeIndex>({
      type: '@@-example-code-index',
      data: exampleIndex,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="mb-4 flex gap-x-4 self-end">
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
      <div className="relative flex flex-1">
        <PanelGroup
          direction="horizontal"
          className={cn(
            'opacity-0',
            'transition-opacity delay-0 duration-0 ease-in-out',
            {
              'opacity-100 duration-300 delay-100': !isLoading,
            },
          )}
        >
          <Panel
            defaultSize={50}
            minSize={30}
            className="relative"
          >
            <div
              ref={refEditor}
              className="size-full"
            />
            <div
              className={cn('absolute left-0 top-0', 'flex flex-col gap-y-3')}
            >
              <button
                type="button"
                className={cn(
                  'flex items-center justify-center',
                  'h-8 w-8',
                  'text-gray-500 hover:text-gray-300',
                  'transition-colors duration-300',
                )}
                onClick={handleReloadSnipped}
              >
                <Icon name="icon-reload" size={[16]} />
              </button>
            </div>
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

          <Panel defaultSize={50} minSize={30}>
            <PanelGroup direction="vertical" autoSaveId="conditional">
              <div className="flex h-10 w-full items-center justify-start bg-[#151515] px-3">
                <div className="flex items-center justify-start space-x-1.5">
                  <span className="size-3 rounded-full bg-red-400" />
                  <span className="size-3 rounded-full bg-yellow-400" />
                  <span className="size-3 rounded-full bg-green-400" />
                </div>

                <div
                  className={cn(
                    'ml-auto',
                    'flex items-center gap-x-3',
                    'z-10',
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    )}
                    onClick={handleClear}
                  >
                    Clear Console
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    )}
                    onClick={handleStop}
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    )}
                    onClick={handleRun}
                  >
                    Run
                  </button>
                </div>
              </div>

              {
                canPreview && (
                  <>
                    <Panel
                      order={1}
                      defaultSize={50}
                      className="flex"
                    >
                      <div className="flex-1">
                        <div className="relative size-full border-t-0 bg-[#151515]">
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
                order={2}
                defaultSize={50}
                minSize={30}
                className="relative bg-[#151515]"
              >
                {
                  !canPreview && (
                    <Iframe classNames="hidden" />
                  )
                }
                <Console />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>

        <div
          className={cn(
            `absolute inset-0 z-20 flex items-center justify-center`,
            'pointer-events-none opacity-0',
            'transition-opacity duration-300 ease-in-out',
            {
              'opacity-100': isLoading,
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
    </>
  );
};

export default TypeScriptEditor;
