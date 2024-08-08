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

interface EditorActionsProps {
  onChangeView: (event: React.MouseEvent) => void;
  tabView: string;
}

export const EditorActions: React.FC<EditorActionsProps> = ({ onChangeView, tabView }) => {
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
        'z-10 w-full pb-4 pl-14 pt-6',
        'dark:bg-dev-black-800',
      )}
    >
      <div className="flex gap-4">
        <button
          className={cn(
            'px-10 py-2.5',
            'font-geist text-body2-regular text-dev-black-300 hover:text-dev-black-1000',
            'dark:text-dev-purple-300 dark:hover:text-dev-purple-50',
            'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
            'transform transition-colors duration-300 ease-in-out',
            {
              ['border-b-2 border-dev-pink-500']: tabView === 'editor',
            },
          )}
          onClick={onChangeView}
        >
          Editor
        </button>
        <button
          className={cn(
            'px-8 py-2.5',
            'font-geist text-body2-regular text-dev-black-300 hover:text-dev-black-1000',
            ' dark:text-dev-purple-300 dark:hover:text-dev-purple-50 ',
            'border-b-2 border-b-transparent hover:border-b-dev-pink-500',
            'transform transition-colors duration-300 ease-in-out',
            {
              ['border-b-2 border-dev-pink-500']: tabView === 'readme',
            },
          )}
          onClick={onChangeView}
        >
          Read me
        </button>

      </div>

      <div className="flex gap-2 pr-2">
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
                className="p-2 hover:bg-dev-purple-700"
                onClick={handleStop}
              >
                <Icon name="icon-pause" />
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
