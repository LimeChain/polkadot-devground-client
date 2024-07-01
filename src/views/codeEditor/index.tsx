import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import * as papiDescriptors from '@polkadot-api/descriptors';
import * as monaco from 'monaco-editor';
import {
  Suspense,
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
import { transform } from 'sucrase';

import { Icon } from '@components/icon';
import { cn } from '@utils/helpers';
import {
  storageExists,
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import { Console } from './console';
import {
  iframeConsole,
  iframeImports,
  STORAGE_CACHE_NAME,
  STORAGE_PREFIX,
} from './constants';
import {
  generateOutput,
  prettyPrintMessage,
} from './helpers';
import oneDarkPro from './one-dark-pro.json';
import { demoCodes } from './snippets';

import type {
  IEventBusConsoleMessage,
  IEventBusConsoleMessageReset,
  IEventBusDemoCode,
} from '@custom-types/eventBus';
import type { IConsoleMessage } from '@custom-types/global';

const bg = '#282c34';

const TypeScriptEditor = () => {
  const refTimeout = useRef<NodeJS.Timeout>();
  const refExampleIndex = useRef<number>(0);
  const refIframe = useRef<HTMLIFrameElement | null>(null);
  const refURL = useRef<string>('');
  const refEditor = useRef<HTMLDivElement | null>(null);
  const refMonacoEditor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const refCompiledCode = useRef<string>('');
  const refCode = useRef<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (refEditor.current) {
      monaco.editor.defineTheme('one-dark-pro', oneDarkPro as never);

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      refMonacoEditor.current = monaco.editor.create(refEditor.current, {
        value: refCode.current,
        language: 'typescript',
        theme: 'one-dark-pro',
        minimap: { enabled: false },
        wordWrap: 'wordWrapColumn',
        wordWrapColumn: 140,
        wordWrapBreakAfterCharacters: ' ,.;',
        automaticLayout: true,
        folding: true,
      });

      const compilerOptions = {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        allowSyntheticDefaultImports: true,
        allowUmdGlobalAccess: true,
        esModuleInterop: true,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        lib: ['esnext', 'dom'],
        typeRoots: ['node_modules/@types'],
        skipLibCheck: true,
        resolveJsonModule: true,
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        noEmit: true,
        strict: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      };

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);

      monaco.languages.typescript.typescriptDefaults.addExtraLib(`
        declare const papiDescriptors = ${JSON.stringify(papiDescriptors)};
      `, 'papiDescriptors.d.ts');

      refMonacoEditor.current?.onDidChangeModelContent(() => {
        clearTimeout(refTimeout.current);
        refCode.current = refMonacoEditor.current?.getValue() || '';

        void storageSetItem(
          STORAGE_CACHE_NAME,
          `${STORAGE_PREFIX}-${refExampleIndex.current}`,
          refCode.current,
        );

        refTimeout.current = setTimeout(async () => {
          const snippet = await generateOutput(refCode.current);
          monaco.languages.typescript.typescriptDefaults.addExtraLib(`
            ${snippet.types}
          `, 'global.d.ts');
        }, 200);
      });

    }

    return () => {
      clearTimeout(refTimeout.current);
      refMonacoEditor.current?.dispose();
    };
  }, []);

  const destroyIframe = useCallback(() => {
    if (refIframe.current) {
      const iframeDoc =
        refIframe.current.contentDocument
        || refIframe.current.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write('');
        iframeDoc.close();
      }
    }
    URL.revokeObjectURL(refURL.current);
    refURL.current = '';
  }, []);

  const loadSnippet = useCallback(async (codeSnippetIndex: number) => {
    clearTimeout(refTimeout.current);
    destroyIframe();

    setIsLoading(true);

    busDispatch<IEventBusConsoleMessageReset>({
      type: '@@-console-message-reset',
    });

    const selectedCodeSnippet = demoCodes[codeSnippetIndex];

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
    const snippet = await generateOutput(code, isTempVersionExist);

    refCode.current = snippet.code;

    refTimeout.current = setTimeout(async () => {
      refMonacoEditor.current?.setValue(snippet.code);
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
    void loadSnippet(0);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEventBus<IEventBusDemoCode>('@@-example-code', ({ data }) => {
    void loadSnippet(data);
  });

  const handleRun = useCallback(async () => {
    clearTimeout(refTimeout.current);
    destroyIframe();

    try {
      const filteredCode = refCode.current.replace(/import[\s\S]+?from\s+['"][^'"]+['"];?/g, '');

      const compiledCode = transform(filteredCode, { transforms: ['typescript'] }).code;

      refCompiledCode.current = compiledCode;

      const blobContent = `
        ${iframeConsole}
        ${iframeImports}
        (async () => {
          try {
            ${compiledCode}
          } catch (e) {
            logger.log('Error:', e.message);
          }
        })();
      `;

      const blob = new Blob([blobContent], { type: 'application/javascript' });
      refURL.current = URL.createObjectURL(blob);

      const iframeDoc = refIframe.current?.contentWindow?.document;
      if (iframeDoc) {
        const scriptBlob = iframeDoc.createElement('script');
        scriptBlob.type = 'module';
        scriptBlob.src = refURL.current;

        iframeDoc.body.appendChild(scriptBlob);

        refTimeout.current = setTimeout(() => {
          destroyIframe();
        }, 60000);
      }
    } catch (err) {
      const messages: IConsoleMessage[] = [
        {
          ts: new Date().getTime(),
          message: `Error: ${(err as Error).message}`,
        },
      ];

      busDispatch<IEventBusConsoleMessage>({
        type: '@@-console-message',
        data: messages,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = useCallback(() => {
    busDispatch<IEventBusConsoleMessageReset>({
      type: '@@-console-message-reset',
    });
  }, []);

  const handleStop = useCallback(() => {
    destroyIframe();
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

  return (
    <Suspense>
      <div className="relative flex flex-1 overflow-hidden p-4">
        <PanelGroup direction="horizontal" className="gap-x-3">
          <Panel
            defaultSize={50}
            minSize={20}
            className={cn(
              'relative',
              'rounded-lg',
              `bg-[${bg}]`,
              'overflow-hidden',
            )}
          >
            <div ref={refEditor} className="size-full p-2" />
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
          <PanelResizeHandle className="w-[2px] hover:bg-[#282c34] active:bg-[#282c34]" />
          <Panel
            defaultSize={50}
            minSize={20}
            className={cn(
              'relative rounded-lg',
              `bg-[#282c34]`,
              'overflow-hidden',
              'flex flex-col',
            )}
          >
            <div className="flex flex-1 items-stretch overflow-hidden py-2 pl-3 pr-1.5">
              <div
                className={cn(
                  'absolute right-4 top-2',
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
              <Console />
            </div>
          </Panel>
        </PanelGroup>
        <div
          className={cn(
            `absolute inset-0 z-20 flex items-center justify-center bg-gray-900`,
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
      <iframe ref={refIframe} className="hidden" />
    </Suspense>
  );
};

export default TypeScriptEditor;
