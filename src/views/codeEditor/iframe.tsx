import { useEventBus } from '@pivanov/event-bus';
import {
  useCallback,
  useRef,
  useState,
} from 'react';
import { transform } from 'sucrase';

import { Loader } from '@components/loader';
import { cn } from '@utils/helpers';

import { defaultImportMap } from './constants';
import {
  getImportMap,
  mergeImportMap,
} from './helpers';
import iframe from './iframe.html?raw';

import type {
  IEventBusDemoCode,
  IEventBusIframeDestroy,
} from '@custom-types/eventBus';

const getIframeContent = (script: string, importMap: string) => {
  return iframe.replace('<!-- IMPORT_MAP -->', importMap).replace('<!-- SCRIPT -->', `
    ${script}
  `);
};

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
  const refImportMap = useRef<string>(JSON.stringify(defaultImportMap, null, 2));
  const [blobUrl, setBlobUrl] = useState('');
  const [showLoading, setShowLoading] = useState(false);

  const generateBlobUrl = useCallback((code: string) => {
    let html = '';

    try {
      const output = transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic',
        production: true,
        filePath: 'index.js',
        sourceMapOptions: {
          compiledFilename: 'index.min.js',
        },
      });

      html = getIframeContent(output.code, refImportMap.current);
    } catch (e) {
      html = `
        <style>
          :root {
            color-scheme: light dark;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }

          htmp, body {
            margin: 0;
            background-color: Canvas;
            color: CanvasText;
          }
        </style>
        <h3>Error ocurred! Check your code</h3>
        <pre>${e}</pre>
      `;
    }

    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    console.log(html);

    setBlobUrl(url);
  }, []);

  useEventBus<IEventBusDemoCode>('@@-example-code', ({ data }) => {
    clearTimeout(refTimeout.current);
    setShowLoading(true);
    revokeBlobUrl(blobUrl);
    refTimeout.current = setTimeout(() => {
      const res = mergeImportMap(defaultImportMap, getImportMap(data));
      refImportMap.current = JSON.stringify(res, null, 2);

      generateBlobUrl(data);
    }, 800);
  }, [blobUrl]);

  useEventBus<IEventBusIframeDestroy>('@@-iframe-destroy', () => {
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
        className={cn('size-full flex-1 border-0', classNames)}
      />
      <div
        className={cn(
          'absolute inset-0 items-center justify-center',
          'pointer-events-none',
          'opacity-0',
          'bg-white dark:bg-[#282c34]',
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
