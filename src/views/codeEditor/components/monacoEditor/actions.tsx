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

import { downloadZip } from '@utils/downloadZip';
import { cn } from '@utils/helpers';
import { defaultImportMap } from '@views/codeEditor/constants';
import {
  getImportMap,
  mergeImportMap,
} from '@views/codeEditor/helpers';

import type {
  IEventBusMonacoEditorLoadSnippet,
  IEventBusMonacoEditorUpdateCode,
} from '@custom-types/eventBus';

export const EditorActions = () => {
  const refTimeout = useRef<NodeJS.Timeout>();
  const refCode = useRef<string>('');

  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning(state => !state);
    busDispatch({
      type: '@@-monaco-editor-execute-snippet',
      data: refCode.current,
    });
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(state => !state);
    busDispatch({
      type: '@@-iframe-destroy',
    });
  }, []);

  const handleDownload = useCallback(async () => {
    const getPackageVersion = async (packageName: string) => {
      try {
        const response = await fetch(packageName);
        if (response.ok) {
          const html = await response.text();
          const versionMatch = html.match(/@([0-9]+\.[0-9]+\.[0-9]+)/);
          if (versionMatch) {
            return versionMatch[1];
          }
        }
      } catch (error) {
        console.error(`Failed to fetch version for package ${packageName}:`, error);
      }
      return 'latest';
    };

    const cleanPackageName = (url: string) => {
      return url.replace('https://esm.sh/', '').split('/')[0];
    };

    const generatePackageJson = async () => {
      const importMap = mergeImportMap(defaultImportMap, getImportMap(refCode.current));
      const dependencies: { [key: string]: string } = {};

      for (const url of Object.values(importMap.imports || {})) {
        const packageName = cleanPackageName(url);
        const version = await getPackageVersion(url);
        dependencies[packageName] = version;
      }

      return {
        name: 'your-project-name',
        version: '1.0.0',
        main: 'index.ts',
        dependencies,
      };
    };

    const downloadFiles = async (files: { name: string; content: string }[]) => {
      try {
        await downloadZip('example', files);
      } catch (error) {
        console.error('Failed to download zip file:', error);
      }
    };

    const packageJson = await generatePackageJson();

    const files = [
      {
        name: 'index.tsx',
        content: refCode.current,
      },
      {
        name: 'package.json',
        content: JSON.stringify(packageJson, null, 2),
      },
    ];

    await downloadFiles(files);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(refTimeout.current);
    };
  }, []);

  useEventBus<IEventBusMonacoEditorLoadSnippet>('@@-monaco-editor-load-snippet', () => {
    clearTimeout(refTimeout.current);
    busDispatch({
      type: '@@-iframe-destroy',
    });

    refTimeout.current = setTimeout(() => {
      setIsRunning(false);
    }, 300);
  });

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    refCode.current = data;
  });

  return (
    <div
      className={cn(
        'ml-auto',
        'flex items-center gap-x-3', 'z-10',
      )}
    >
      <button
        type="button"
        className={cn(
          'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
        )}
        onClick={handleDownload}
      >
        ZIP
      </button>
      {
        isRunning
          ? (
            <button
              type="button"
              className={cn(
                'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              )}
              onClick={handleStop}
            >
              Stop
            </button>
          )
          : (
            <button
              type="button"
              className={cn(
                'rounded bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
              )}
              onClick={handleRun}
            >
              Run
            </button>
          )
      }
    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
