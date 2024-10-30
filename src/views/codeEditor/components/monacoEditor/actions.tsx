// import { ModalSaveExample } from '@components/modals/modalSaveExample';
import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-hot-toast';

import { ModalSaveExample } from '@components/modals/modalSaveExample';
import { downloadZip } from '@utils/downloadZip';
import { cn } from '@utils/helpers';
import {
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';
import { defaultImportMap } from '@views/codeEditor/constants';
import { useStoreCustomExamples } from 'src/stores/examples';

import { ActionButton } from '../actionButton';

import type { IEventBusMonacoEditorUpdateCode } from '@custom-types/eventBus';

export const EditorActions = () => {
  const { name, code } = useStoreCustomExamples.use.selectedExample();
  const [
    isDownloading,
    setIsDownloading,
  ] = useState(false);

  const [
    SaveExampleModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalSaveExample);

  const refCode = useRef(code);

  const [
    isRunning,
    setIsRunning,
  ] = useState(false);

  const handleRun = useCallback(() => {
    setIsRunning(true);
    busDispatch({
      type: '@@-monaco-editor-execute-snippet',
      data: refCode.current,
    });
  }, []);

  const handleStop = useCallback(() => {
    setIsRunning(false);
    busDispatch({
      type: '@@-iframe-destroy',
    });
  }, []);

  const handleDownload = useCallback(async () => {
    const getPackageVersion = async (packageName: string) => {
      try {
        setIsDownloading(true);
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
      } finally {
        setIsDownloading(false);
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const downloadFiles = async (_files: { name: string; content: string }[]) => {
      try {
        await downloadZip();
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
  }, [name]);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('URL copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy URL to clipboard:', err);
      toast.error('Failed to copy URL to clipboard');
    });
  }, []);

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    if (data !== null) {
      refCode.current = data;
    }

    handleStop();
  });

  return (
    <div
      className={cn(
        'absolute right-0 top-4',
        'flex items-center justify-between',
        'z-20',
      )}
    >
      <div className="flex gap-2 pr-2">
        <ActionButton
          iconName="icon-share"
          onClick={handleShare}
          toolTip="Share"
        />
        <ActionButton
          iconName="icon-save"
          onClick={toggleVisibility}
          toolTip="Save to GitHub"
        />
        <ActionButton
          iconName="icon-download"
          isLoading={isDownloading}
          onClick={handleDownload}
          toolTip="Download"
        />
        {isRunning
          ? (
            <ActionButton
              iconName="icon-pause"
              onClick={handleStop}
              toolTip="Stop execution"
            />
          )
          : (
            <ActionButton
              fill="red"
              iconName="icon-play"
              onClick={handleRun}
              toolTip="Run"
            />
          )}
      </div>
      <SaveExampleModal
        code={refCode.current}
        onClose={toggleVisibility}
      />
    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
