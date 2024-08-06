import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
  useState,
} from 'react';

import { Loader } from '@components/loader';
import { cn } from '@utils/helpers';
import {
  generateBlobUrl,
  getImportMap,
  mergeImportMap,
} from '@utils/iframe';
import { defaultImportMap } from '@views/codeEditor/constants';

import type {
  IEventBusIframeDestroy,
  IEventBusMonacoEditorExecuteSnippet,
} from '@custom-types/eventBus';

const revokeBlobUrl = (url: string) => {
  if (url) {
    URL.revokeObjectURL(url);
  }
  return URL.createObjectURL(new Blob([''], { type: 'text/html' }));
};

interface IframeProps {
  classNames?: string;
}

export const Iframe = (props: IframeProps) => {
  const { classNames } = props;
  const refTimeout = useRef<NodeJS.Timeout>();

  const refIframe = useRef<HTMLIFrameElement>(null);
  const [blobUrl, setBlobUrl] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  useEventBus<IEventBusMonacoEditorExecuteSnippet>('@@-monaco-editor-execute-snippet', ({ data }) => {
    clearTimeout(refTimeout.current);
    setShowLoading(true);
    revokeBlobUrl(blobUrl);
    refTimeout.current = setTimeout(() => {
      const res = mergeImportMap(getImportMap(data), defaultImportMap);
      const importMap = JSON.stringify(res, null, 2);

      const blobUrl = generateBlobUrl(data, importMap);
      setBlobUrl(blobUrl);
    }, 800);
  }, [blobUrl]);

  useEventBus<IEventBusIframeDestroy>('@@-iframe-destroy', () => {
    setBlobUrl('');
    revokeBlobUrl(blobUrl);
  });

  const onLoad = useCallback(() => {
    setShowLoading(false);
  }, []);

  return (
    <>
      <iframe
        ref={refIframe}
        src={blobUrl}
        onLoad={onLoad}
        className={cn(
          'size-full flex-1 border-0',
          {
            ['hidden']: blobUrl === '',
          },
          classNames,
        )}
      />
      <div
        className={cn(
          'absolute inset-0 items-center justify-center',
          'pointer-events-none',
          'opacity-0',
          'bg-dev-purple-200 dark:bg-dev-black-800',
          'delay-400 transition-opacity duration-500 ease-in-out',
          'z-100',
          {
            ['opacity-100 delay-0']: showLoading,
          },
        )}
      >
        <Loader />
      </div>
    </>
  );
};

Iframe.displayName = 'Iframe';
