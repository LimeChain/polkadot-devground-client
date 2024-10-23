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

import { ModalSaveExample } from '@components/modals/modalSaveExample';
import { downloadZip } from '@utils/downloadZip';
import {
  cn,
  getSearchParam,
} from '@utils/helpers';
import {
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';
import { defaultImportMap } from '@views/codeEditor/constants';
import { useStoreCustomExamples } from 'src/stores/customExamples';

import { ActionButton } from '../actionButton';

import type {
  IEventBusMonacoEditorLoadSnippet,
  IEventBusMonacoEditorUpdateCode,
} from '@custom-types/eventBus';

export const EditorActions = () => {
  const [
    SaveExampleModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalSaveExample);
  const selectedExampleId = useStoreCustomExamples.use.selectedExampleId();
  const isSavingContent = useStoreCustomExamples.use.isSavingContent();
  const { updateCustomExampleContent } = useStoreCustomExamples.use.actions();
  const refCode = useRef<string>('');
  const initCode = useRef<string>('');
  const isInit = useRef(false);

  const [
    isEdited,
    setIsEdited,
  ] = useState(false);

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
  }, []);

  const handleSave = useCallback(() => {
    updateCustomExampleContent(selectedExampleId, refCode.current);
  }, [
    selectedExampleId,
    updateCustomExampleContent,
  ]);

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    const isCustomExample = !!getSearchParam('c');

    if (data !== null && isCustomExample) {
      refCode.current = data;

      if (!isInit.current) {
        initCode.current = data;
        isInit.current = true;
      }

      setIsEdited(initCode.current !== data);
    }
  });

  useEventBus<IEventBusMonacoEditorLoadSnippet>('@@-monaco-editor-load-snippet', () => {
    setIsEdited(false);
    isInit.current = false;
    handleStop();
  });

  return (
    <div
      className={cn(
        'absolute right-0 top-0',
        'flex items-center justify-between',
        'z-20 py-4 pl-14',
      )}
    >
      <div className="flex gap-2 pr-2">
        {
          isEdited && (
            <ActionButton
              iconName="icon-save"
              isLoading={isSavingContent}
              onClick={handleSave}
              toolTip="Revert changes"
            />
          )
        }
        <ActionButton
          iconName="icon-share"
          toolTip="Share"
        />
        <ActionButton
          iconName="icon-uploadCloud"
          onClick={toggleVisibility}
          toolTip="Save to GitHub"
        />
        <ActionButton
          iconName="icon-download"
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
        type="upload"
      />
    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
