import { setupTypeAcquisition } from '@typescript/ata';
import { format } from 'prettier';
// eslint-disable-next-line import/default
import prettierPluginEstree from 'prettier/plugins/estree';
import parserTypeScript from 'prettier/plugins/typescript';
import typescript from 'typescript';

import { sleep } from '@utils/helpers';

const loadedFilesCache = new Set<string>();

export const setupAta = (
  onDownloadFile?: (code: string, path: string) => void,
  onFinished?: (files: Map<string, string>) => void,
  onStarted?: () => void,
  onErrorMessage?: (userFacingMessage: string, error: Error) => void,
  onProgress?: (progress: number) => void,
  throttleMs = 200,
) => {
  const failedDownloads = new Set<string>();
  let lastFetchTime = 0;

  const customFetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime;

    if (timeSinceLastFetch < throttleMs) {
      await sleep(throttleMs - timeSinceLastFetch);
    }

    lastFetchTime = Date.now();

    const response = await fetch(input.toString(), init);

    return response;
  };

  const customErrorMessage = (userFacingMessage: string, error: Error) => {
    console.error('Error during type acquisition:', userFacingMessage, error);
    if (error.message) {
      const pathMatch = error.message.match(/at (\S+):/);
      if (pathMatch && pathMatch[1]) {
        failedDownloads.add(pathMatch[1]);
      }
    }
    onErrorMessage?.(userFacingMessage, error);
  };

  return setupTypeAcquisition({
    typescript,
    projectName: 'react-playground',
    fetcher: customFetcher,
    delegate: {
      receivedFile: (code, path) => {
        if (!loadedFilesCache.has(path)) {
          loadedFilesCache.add(path);
          onDownloadFile?.(code, path);
        }
      },
      started: onStarted,
      finished: (files) => {
        onProgress?.(100);
        onFinished?.(files);
      },
      errorMessage: customErrorMessage,
      progress: (downloaded, estimatedTotal) => {
        const progress = Math.round((downloaded / estimatedTotal) * 100);
        onProgress?.(progress);
      },
    },
  });
};

export const prettyPrintMessage = (message: string): string => {
  try {
    const parsedMessage = JSON.parse(message);
    return JSON.stringify(parsedMessage, null, 2);
  } catch (e) {
    return message;
  }
};

export const formatCode = async (code: string) => {
  try {
    const r = await format(code, {
      parser: 'typescript',
      plugins: [parserTypeScript, prettierPluginEstree],
      semi: true,
      singleQuote: false,
      trailingComma: 'all',
      bracketSpacing: true,
      arrowParens: 'always',
    });
    return r;
  } catch (error) {
    return code;
  }
};
