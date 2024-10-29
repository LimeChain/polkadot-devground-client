// import { ModalSaveExample } from '@components/modals/modalSaveExample';
import {
  busDispatch,
  useEventBus,
} from '@pivanov/event-bus';
import { useToggleVisibility } from '@pivanov/use-toggle-visibility';
import {
  useCallback,
  useEffect,
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
import { useStoreCustomExamples } from 'src/stores/examples';

import { ActionButton } from '../actionButton';

import type { IEventBusMonacoEditorUpdateCode } from '@custom-types/eventBus';

export const EditorActions = () => {
  const { updateExampleContent } = useStoreCustomExamples.use.actions();
  const isSavingContent = useStoreCustomExamples.use.isSavingContent();
  const selectedExample = useStoreCustomExamples.use.selectedExample();

  const refCode = useRef<string>('');
  const initCode = useRef<string>('');
  const isInit = useRef(false);

  const [
    SaveExampleModal,
    toggleVisibility,
  ] = useToggleVisibility(ModalSaveExample);

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

  useEventBus<IEventBusMonacoEditorUpdateCode>('@@-monaco-editor-update-code', ({ data }) => {
    const isCustomExample = !!getSearchParam('c');

    if (data !== null) {
      refCode.current = data;

      if (!isInit.current) {
        initCode.current = data;
        isInit.current = true;
      }

      isCustomExample && setIsEdited(initCode.current !== data);
    }
  });

  useEffect(() => {
    setIsEdited(false);
    isInit.current = false;
    handleStop();
  }, [
    handleStop,
    selectedExample,
  ]);
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
          // onClick={toggleVisibility}
          toolTip="Share"
        />
        <ActionButton
          iconName="icon-save"
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
      {/* <SaveExampleModal
        code={refCode.current}
        onClose={toggleVisibility}
        type="upload"
      /> */}
      <SaveExampleModal
        code={refCode.current}
        onClose={toggleVisibility}
      />
    </div>
  );
};

EditorActions.displayName = 'Editor Actions';
