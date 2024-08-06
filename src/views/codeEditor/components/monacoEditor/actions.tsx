import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Icon } from '@components/icon';
import { downloadZip } from '@utils/downloadZip';
import { cn } from '@utils/helpers';
import {
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';
import { defaultImportMap } from '@views/codeEditor/constants';

import type { IEventBusMonacoEditorUpdateCode } from '@custom-types/eventBus';

export const EditorActions = () => {
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

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    refCode.current = data;
  });

  return (
    <div
      className={cn(
        'ml-auto',
        'flex items-center justify-between',
        'z-10 w-full pb-5 pt-6',
        'dark:bg-dev-black-700',
      )}
    >
      <div>
        <button className="border-b-2 border-dev-pink-500 px-8 py-2.5 font-geist text-body2-regular">
          Editor
        </button>
        <button className="px-8 py-2.5 font-geist text-body2-regular">
          Read me
        </button>
      </div>

      <div className="flex gap-2">
        <button className="p-2 hover:bg-dev-purple-700">
          <Icon name="icon-share" />
        </button>
        <button className="p-2 hover:bg-dev-purple-700">
          <Icon name="icon-save" />
        </button>
        <button
          className="p-2 hover:bg-dev-purple-700"
          onClick={handleDownload}
        >
          <Icon name="icon-download" />
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
                className="p-2 hover:bg-dev-purple-700"
                onClick={handleRun}
              >
                <Icon name="icon-play" fill="red" />
              </button>
            )
        }
      </div>

    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
