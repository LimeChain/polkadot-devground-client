import { setupTypeAcquisition } from '@typescript/ata';
import { format } from 'prettier';
// eslint-disable-next-line import/default
import prettierPluginEstree from 'prettier/plugins/estree';
import parserTypeScript from 'prettier/plugins/typescript';
import typescript from 'typescript';

import { sleep } from '@utils/helpers';

export const setupAta = (
  onDownloadFile?: (code: string, path: string) => void,
  onFinished?: (files: Map<string, string>) => void,
  onStarted?: () => void,
  onErrorMessage?: (userFacingMessage: string, error: Error) => void,
  onProgress?: (progress: number) => void,
  throttleMs = 100, // Throttle delay
) => {
  const failedDownloads = new Set<string>();
  let lastFetchTime = 0;

  const customFetcher = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    try {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;

      if (timeSinceLastFetch < throttleMs) {
        await sleep(throttleMs - timeSinceLastFetch);
      }

      lastFetchTime = Date.now();

      // Check if fetch is available in the current context
      if (typeof fetch === 'undefined') {
        throw new Error('Fetch API is not available in the current environment');
      }

      return fetch(input, init);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('Failed to fetch')) {
        const path = new URL((input as Request).url || input.toString()).pathname;
        failedDownloads.add(path);
      }
      throw err;
    }
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
      receivedFile: onDownloadFile,
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

// @TODO: @pivanov: This function is not used anywhere in the codebase.
// but is useful for debugging purposes.
export const parseImports = (code: string): string[] => {
  const importRegex = /import\s+(?:\*\s+as\s+\w+|\w+\s*,\s*)?(?:{[^}]+}|\w+)?\s+from\s+['"][^'"]+['"]/g;
  return code.match(importRegex) || [];
};

export const prettyPrintMessage = (message: string): string => {
  try {
    const parsedMessage = JSON.parse(message);
    return JSON.stringify(parsedMessage, null, 2);
  } catch (e) {
    return message;
  }
};

type ChainClient = 'polkadot' | 'rococo';

const chainsLib : {
  [key in ChainClient]: {
    knownChain: string;
    descriptor:string;
  }
} = {
  polkadot: {
    knownChain: 'polkadot', descriptor: 'dot',
  },
  rococo: { knownChain: 'rococo_v2_2', descriptor: 'rococo' },
};

export const startChainClient = ({ chain }: { chain: ChainClient }): string => {
  return `
    const provider = WebSocketProvider("wss://rococo-rpc.polkadot.io")
    const client = createClient(provider);
    const api = client.getTypedApi(papiDescriptors.${chainsLib[chain].descriptor});
  `;
};

// @pivanov
export interface ImportMap {
  imports?: Record<string, string>;
  scopes?: Record<string, string>;
}

export function getImportMap(code: string) {
  const importRegex = /import\s+(?:type\s+)?(?:\{[^}]*\}|[^'"]*)\s+from\s+['"]([^'"]+)['"]|import\s+['"]([^'"]+)['"]/g;

  const importSet = new Set<string>();

  let match: RegExpExecArray | null = importRegex.exec(code);

  while (match !== null) {
    const importPath = match[1] || match[2];
    const isRelative = ['.', '/'].some((e) => importPath.startsWith(e));
    if (!isRelative) {
      importSet.add(importPath);
    }
    match = importRegex.exec(code);
  }

  const importMap: ImportMap = { imports: {}, scopes: {} };

  importMap.imports ??= {};

  for (const pkg of importSet) {
    importMap.imports[pkg] = `https://esm.sh/${pkg}`;
  }

  return importMap;
}

export function mergeImportMap(...maps: ImportMap[]): ImportMap {
  const importMap: ImportMap = {
    imports: {},
    scopes: {},
  };

  for (const map of maps) {
    importMap.imports = {
      ...importMap.imports,
      ...(map.imports ?? {}),
    };

    importMap.scopes = {
      ...importMap.scopes,
      ...(map.scopes ?? {}),
    };
  }

  return importMap;
}

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
