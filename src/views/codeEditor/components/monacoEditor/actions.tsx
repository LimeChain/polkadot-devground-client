import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { downloadZip } from '@utils/downloadZip';
import { cn } from '@utils/helpers';
import {
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';
import { defaultImportMap } from '@views/codeEditor/constants';

import { ActionButton } from '../actionButton';

import type { IEventBusMonacoEditorUpdateCode } from '@custom-types/eventBus';

export const EditorActions = () => {
  const refCode = useRef<string>('');
  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning((state) => !state);
    busDispatch({
      type: '@@-monaco-editor-execute-snippet',
      data: refCode.current,
    });
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning((state) => !state);
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

    const generatePackageJson = async () => {
      const importMap = mergeImportMap(defaultImportMap, getImportMap(refCode.current));
      const dependencies: { [key: string]: string } = {};

      for (const url of Object.values(importMap.imports || {})) {
        const packageName = url.replace('https://esm.sh/', '').split('/')[0];
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
        'absolute right-2 top-0',
        'flex items-center justify-between',
        'z-20 py-4 pl-14',
        'dark:bg-dev-black-800',
      )}
    >
      <div className="flex gap-2 pr-2">
        <ActionButton iconName="icon-share" />
        <ActionButton iconName="icon-save" />
        <ActionButton
          iconName="icon-download"
          onClick={handleDownload}
        />
        {isRunning
          ? (
            <ActionButton
              iconName="icon-pause"
              onClick={handleStop}
            />
          )
          : (
            <ActionButton
              fill="red"
              iconName="icon-play"
              onClick={handleRun}
            />
          )}
      </div>

    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
