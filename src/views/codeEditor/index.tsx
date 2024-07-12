import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import * as PAPI_SIGNER from '@polkadot-api/signer';
import * as PAPI_WS_PROVIDER_WEB from '@polkadot-api/ws-provider/web';
import { shikiToMonaco } from '@shikijs/monaco/index.mjs';
import * as monaco from 'monaco-editor';
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
import { useStoreUI } from '@stores';
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

import {
  STORAGE_CACHE_NAME,
  STORAGE_PREFIX,
} from './constants';
import {
  formatCode,
  prettyPrintMessage,
  setupAta,
} from './helpers';
import { Iframe } from './iframe';
import { monacoEditorConfig } from './monaco-editor-config';
import { PannelDebug } from './pannelDebug';
import { Progress } from './progress';
import { snippets } from './snippets';

import type {
  IEventBusCodeEditorTypesProgress,
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
  IEventBusDemoCode,
  IEventBusDemoCodeIndex,
  IEventBusErrorItem,
  IEventBusIframeDestroy,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

const fetchType = setupAta(
  (code, path) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
  },
  () => {
    // console.log('Finished downloading all files', files);
  },
  () => {
    // console.log('Started downloading files');
  },
  (userFacingMessage, error) => {
    console.error('Custom error handling:', userFacingMessage, error);
  },
  (progress) => {
    busDispatch<IEventBusCodeEditorTypesProgress>({
      type: '@@-code-editor-types-progress',
      data: progress,
    });
  },
);

monaco.languages.css.cssDefaults.setOptions({ validate: false });

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

monaco.languages.typescript.typescriptDefaults.addExtraLib(`
  declare const papiDescriptors = {
    dot: unknown,
    rococo: unknown,
  };
`, 'papiDescriptors.d.ts');

monaco.languages.typescript.typescriptDefaults.addExtraLib(`
  declare module 'polkadot-api/ws-provider/web' {
    export { ${Object.keys(PAPI_WS_PROVIDER_WEB)} } from 'polkadot-api/ws-provider/web';
  }

  declare module 'polkadot-api/signer' {
    export { ${Object.keys(PAPI_SIGNER)} } from 'polkadot-api/signer';
  }
`, 'papi.d.ts');

monaco.languages.typescript.typescriptDefaults.addExtraLib(
  '<<react-definition-file>>',
  'file:///node_modules/@react/types/index.d.ts',
);

const compilerOptions: monaco.languages.typescript.CompilerOptions = {
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  allowSyntheticDefaultImports: true,
  allowUmdGlobalAccess: true,
  jsxFactory: 'React.createElement',
  lib: ['esnext', 'dom'],
  skipLibCheck: true,
  isolatedModules: true,
  resolveJsonModule: true,
  verbatimModuleSyntax: true,
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  noEmit: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  esModuleInterop: true,
  jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
  reactNamespace: 'React',
  allowJs: true,
  typeRoots: ['node_modules/@types'],
};

monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);

const TypeScriptEditor = () => {
  const refTimeout = useRef<NodeJS.Timeout>();
  const refExampleIndex = useRef<number>(1);
  const refEditor = useRef<HTMLDivElement | null>(null);
  const refMonacoEditor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const refModel = useRef<monaco.editor.ITextModel | null>(null);
  const refCode = useRef<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const theme = useStoreUI.use.theme?.();

  useEffect(() => {
    const loadHighlighter = async () => {
      const currentTheme = theme === 'dark' ? 'one-dark-pro' : 'github-light';
      const highlighter = await getSingletonHighlighter({
        themes: ['one-dark-pro', 'github-light'],
        langs: ['tsx', 'typescript', 'json'],
      });

      shikiToMonaco(highlighter, monaco);
      monaco.editor.setTheme(currentTheme);
    };

    const timeoutId = setTimeout(loadHighlighter, 40);
    return () => clearTimeout(timeoutId);
  }, [theme]);

  const createNewModel = (value: string) => {
    refModel.current?.dispose();

    const modelUri = monaco.Uri.parse('file:///main-script.tsx');
    refModel.current = monaco.editor.createModel(value, 'typescript', modelUri);
    refMonacoEditor.current?.setModel(refModel.current);
  };

  const triggerValidation = useCallback(async () => {
    if (refModel.current) {
      const worker = await monaco.languages.typescript.getTypeScriptWorker();
      const client = await worker(refModel.current.uri);

      const [syntacticDiagnostics, semanticDiagnostics] = await Promise.all([
        client.getSyntacticDiagnostics(refModel.current.uri.toString()),
        client.getSemanticDiagnostics(refModel.current.uri.toString()),
      ]);

      const allDiagnostics = [...syntacticDiagnostics, ...semanticDiagnostics];

      const markers = allDiagnostics.map((diag) => {
        const startPos = refModel.current!.getPositionAt(diag.start || 0);
        const endPos = refModel.current!.getPositionAt(
          (diag.start || 0) + (diag.length || 0),
        );

        return {
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
          message:
            diag.code === 2307
              ? 'Unable to compile due to a missing module. Please ensure all modules are installed and properly configured.'
              : typeof diag.messageText === 'string'
                ? diag.messageText
                : diag.messageText.messageText,
        };
      });

      monaco.editor.setModelMarkers(refModel.current, 'typescript', markers);

      setTimeout(() => {
        busDispatch<IEventBusErrorItem>({
          type: '@@-problems-message',
          data: markers,
        });
      }, 40);
    }
  }, []);

  useEffect(() => {
    if (refEditor.current) {
      createNewModel(refCode.current);

      refMonacoEditor.current = monaco.editor.create(refEditor.current, {
        ...monacoEditorConfig,
        model: refModel.current,
        automaticLayout: true,
        folding: true,
      });

      refMonacoEditor.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
        if (refMonacoEditor.current) {
          clearTimeout(refTimeout.current);
          const currentPosition = refMonacoEditor.current.getPosition();

          const code = refMonacoEditor.current.getValue() || '';
          refCode.current = await formatCode(code);
          createNewModel(refCode.current);

          if (currentPosition) {
            refMonacoEditor.current.setPosition(currentPosition);
            refMonacoEditor.current.revealPositionInCenter(currentPosition);
          }

          refTimeout.current = setTimeout(() => {
            void triggerValidation();
          }, 400);
        }
      },
      );

      refMonacoEditor.current.onDidChangeModelContent(() => {
        clearTimeout(refTimeout.current);
        refCode.current = refMonacoEditor.current?.getValue() || '';

        void storageSetItem(
          STORAGE_CACHE_NAME,
          `${STORAGE_PREFIX}-${refExampleIndex.current}`,
          refCode.current,
        );

        refTimeout.current = setTimeout(() => {
          busDispatch<IEventBusCodeEditorTypesProgress>({
            type: '@@-code-editor-types-progress',
            data: 0,
          });

          refTimeout.current = setTimeout(async () => {
            await fetchType(refCode.current);

            void triggerValidation();
          }, 40);
        }, 400);
      });
    }

    return () => {
      clearTimeout(refTimeout.current);
      refMonacoEditor.current?.dispose();
      refModel.current?.dispose();
    };
  }, [triggerValidation]);

  const loadSnippet = useCallback(
    async (codeSnippetIndex: number) => {
      clearTimeout(refTimeout.current);

      setIsLoading(true);

      busDispatch<IEventBusConsoleMessageReset>({
        type: '@@-console-message-reset',
      });

      const selectedCodeSnippet =
        snippets.find((f) => f.id === codeSnippetIndex) || snippets[0];

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

      refCode.current = await formatCode(code);

      setSearchParam('s', codeSnippetIndex);

      createNewModel(refCode.current);

      refTimeout.current = setTimeout(async () => {
        setIsLoading(false);
        await fetchType(refCode.current);
        void triggerValidation();
      }, 400);
    },
    [triggerValidation],
  );

  useEffect(() => {
    const snippetIndex = getSearchParam('s') || 1;
    void loadSnippet(Number(snippetIndex));
  }, [loadSnippet]);

  useEventBus<IEventBusDemoCodeIndex>('@@-example-code-index', ({ data }) => {
    void loadSnippet(data);
  });

  const handleRun = useCallback(async () => {
    clearTimeout(refTimeout.current);
    busDispatch<IEventBusDemoCode>({
      type: '@@-example-code',
      data: refCode.current,
    });
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
  }, []);

  const handleReloadSnippet = useCallback(() => {
    void storageRemoveItem(
      STORAGE_CACHE_NAME,
      `${STORAGE_PREFIX}-${refExampleIndex.current}`,
    );
    window.location.reload();
  }, []);

  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data.type === 'customLog') {
      const messages: IConsoleMessage[] = [
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

  const canPreview = refCode.current.includes('createRoot');

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const exampleIndex = Number(e.currentTarget.getAttribute('data-example'));
    busDispatch<IEventBusDemoCodeIndex>({
      type: '@@-example-code-index',
      data: exampleIndex,
    });
  }, []);

  return (
    <div className="max-w-screen flex h-full flex-col overflow-hidden">
      <div className="mb-4 flex flex-wrap gap-x-4 self-end">
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
            id="left"
            order={1}
            defaultSize={50}
            minSize={30}
            className="relative"
          >
            <div ref={refEditor} className="size-full" />
            <Progress classNames="absolute top-2 right-6 z-100" size={18} />
            <div className={cn('absolute left-0 top-0', 'flex flex-col gap-y-3')}>
              <button
                type="button"
                className={cn(
                  'flex items-center justify-center',
                  'h-8 w-8',
                  'text-gray-500 hover:text-gray-300',
                  'transition-colors duration-300',
                )}
                onClick={handleReloadSnippet}
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

          <Panel
            id="right"
            order={2}
            defaultSize={50}
            minSize={30}
          >
            <PanelGroup direction="vertical" autoSaveId="conditional">
              <div className="flex h-10 w-full items-center justify-start bg-white px-3 dark:bg-[#282c34]">
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

              {canPreview && (
                <>
                  <Panel
                    id="right-top"
                    order={1}
                    defaultSize={50}
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
              )}

              <Panel
                id="right-bottom"
                order={2}
                defaultSize={50}
                minSize={30}
                className="relative bg-white dark:bg-[#282c34]"
              >
                <PannelDebug />
                {!canPreview && <Iframe classNames="hidden" />}
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
    </div>
  );
};

export default TypeScriptEditor;
