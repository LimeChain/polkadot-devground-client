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
} from 'react';
import { getSingletonHighlighter } from 'shiki/index.mjs';

import { snippets } from '@constants/snippets';
import { useStoreUI } from '@stores';
import {
  getSearchParam,
  setSearchParam,
} from '@utils/helpers';
import {
  storageExists,
  storageGetItem,
  storageSetItem,
} from '@utils/storage';
import {
  STORAGE_CACHE_NAME,
  STORAGE_PREFIX,
} from '@views/codeEditor/constants';
import {
  formatCode,
  setupAta,
} from '@views/codeEditor/helpers';
import { monacoEditorConfig } from '@views/codeEditor/monaco-editor-config';
import { Progress } from '@views/codeEditor/progress';

import type {
  IEventBusMonacoEditorLoadSnippet,
  IEventBusMonacoEditorUpdateCursorPosition,
} from '@custom-types/eventBus';

monaco.languages.css.cssDefaults.setOptions({ validate: false });

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: false,
  noSyntaxValidation: false,
});

monaco.languages.typescript.typescriptDefaults.addExtraLib(`
  declare const papiDescriptors = {
    dot: unknown,
    rococo: unknown,
    MultiAddress: unknown,
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

export const MonacoEditor = () => {
  const refTimeout = useRef<NodeJS.Timeout>();

  const refSnippet = useRef<string>('');
  const refSnippetIndex = useRef<string | undefined>();
  const refMonacoEditorContainer = useRef<HTMLDivElement | null>(null);
  const refMonacoEditor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const refModel = useRef<monaco.editor.ITextModel | null>(null);

  const theme = useStoreUI.use.theme?.();

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
        const endPos = refModel.current!.getPositionAt((diag.start || 0) + (diag.length || 0));

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
        busDispatch({
          type: '@@-problems-message',
          data: markers,
        });
      }, 40);
    }
  }, []);

  const fetchType = setupAta(
    (code, path) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(code, `file://${path}`);
    },
    () => {
      void triggerValidation();
    },
    () => {},
    (userFacingMessage, error) => {
      console.error('Custom error handling:', userFacingMessage, error);
    },
    (progress) => {
      busDispatch({
        type: '@@-monaco-editor-types-progress',
        data: progress,
      });
    },
  );

  const createNewModel = async (value: string) => {
    refModel.current?.dispose();
    const modelUri = monaco.Uri.parse('file:///main-script.tsx');
    refModel.current = monaco.editor.createModel(value, 'typescript', modelUri);
    refMonacoEditor.current?.setModel(refModel.current);

    await fetchType(refSnippet.current);
    refMonacoEditor.current?.focus();
    void triggerValidation();

    busDispatch({
      type: '@@-monaco-editor-update-code',
      data: value,
    });
  };

  const loadSnippet = useCallback(async (snippetIndex: number | null) => {
    clearTimeout(refTimeout.current);

    busDispatch({
      type: '@@-console-message-reset',
    });

    busDispatch({
      type: '@@-problems-message',
      data: [],
    });

    let code = 'console.log("Hello, World!");';
    if (!!snippetIndex) {
      const selectedCodeSnippet = snippets.find((f) => f.id === snippetIndex) || snippets[0];
      refSnippetIndex.current = String(selectedCodeSnippet.id);

      const isTempVersionExist = await storageExists(STORAGE_CACHE_NAME, `${STORAGE_PREFIX}-${snippetIndex}`);
      code = selectedCodeSnippet.code;

      if (isTempVersionExist) {
        const existingCode = await storageGetItem<string>(STORAGE_CACHE_NAME, `${STORAGE_PREFIX}-${snippetIndex}`);
        code = existingCode || code;
      }

      setSearchParam('s', snippetIndex);
    }

    refSnippet.current = await formatCode(code);
    void createNewModel(refSnippet.current);

    refTimeout.current = setTimeout(async () => {
      busDispatch({
        type: '@@-monaco-editor-hide-loading',
      });
    }, 400);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMonacoCursorPositon = useCallback((currentPosition: monaco.Position) => {
    if (currentPosition) {
      refMonacoEditor.current?.setPosition(currentPosition);
      refMonacoEditor.current?.revealPositionInCenter(currentPosition);
      refMonacoEditor.current?.focus();
    }
  }, []);

  useEffect(() => {
    const snippetIndex = getSearchParam('s');
    void loadSnippet(!!snippetIndex ? Number(snippetIndex) : null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void (async () => {
      const currentTheme = theme === 'dark' ? 'github-dark' : 'github-light';
      const highlighter = await getSingletonHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['tsx', 'typescript', 'json'],
      });

      shikiToMonaco(highlighter, monaco);
      monaco.editor.setTheme(currentTheme);
    })();
  }, [theme]);

  useEffect(() => {
    if (refMonacoEditorContainer.current && !refMonacoEditor.current) {
      refMonacoEditor.current = monaco.editor.create(refMonacoEditorContainer.current, {
        ...monacoEditorConfig,
        model: refModel.current,
        automaticLayout: true,
        folding: true,
      });

      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
      refMonacoEditor.current.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
        if (refMonacoEditor.current) {
          clearTimeout(refTimeout.current);

          const currentPosition = refMonacoEditor.current?.getPosition();

          const code = refMonacoEditor.current.getValue() || '';
          refSnippet.current = await formatCode(code);

          updateMonacoCursorPositon(currentPosition!);

          await fetchType(refSnippet.current);

          refTimeout.current = setTimeout(() => {
            console.log('@@@ pivanov');
            void triggerValidation();
          }, 400);
        }
      });

      refMonacoEditor.current.onDidChangeModelContent(() => {
        clearTimeout(refTimeout.current);
        const currentPosition = refMonacoEditor.current?.getPosition();
        refSnippet.current = refMonacoEditor.current?.getValue() || '';

        if (refSnippetIndex.current) {
          void storageSetItem(STORAGE_CACHE_NAME, `${STORAGE_PREFIX}-${refSnippetIndex.current}`, refSnippet.current);
        }

        busDispatch({
          type: '@@-monaco-editor-update-code',
          data: refSnippet.current,
        });

        refTimeout.current = setTimeout(() => {
          busDispatch({
            type: '@@-monaco-editor-types-progress',
            data: 0,
          });

          updateMonacoCursorPositon(currentPosition!);

          refTimeout.current = setTimeout(async () => {
            void triggerValidation();
          }, 40);
        }, 0);
      });
    }

    return () => {
      clearTimeout(refTimeout.current);
      refModel.current?.dispose();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEventBus<IEventBusMonacoEditorLoadSnippet>('@@-monaco-editor-load-snippet', ({ data }) => {
    clearTimeout(refTimeout.current);

    refTimeout.current = setTimeout(() => {
      void loadSnippet(data.snippetIndex);
    }, 300);
  });

  useEventBus<IEventBusMonacoEditorUpdateCursorPosition>('@@-monaco-editor-update-cursor-position', ({ data }) => {
    updateMonacoCursorPositon(data);
  });

  return (
    <div className="relative flex-1">
      <div ref={refMonacoEditorContainer} className="size-full" />
      <Progress classNames="absolute top-2 right-6 z-100" size={18} />
    </div>
  );
};

MonacoEditor.displayName = 'MonacoEditor';
