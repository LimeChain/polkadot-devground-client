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

export const removeNamedImports = (code: string, namedImportsToRemove: string[]): string => {
  // Regular expression to find import statements
  const importRegex = /^import\s*{([^}]*)}\s*from\s*['"]([^'"]*)['"]\s*;?$/gm;

  // Replace function for imports
  const replaceImport = (match: string, imports: string, moduleName: string): string => {
    // Split the imports by comma and trim whitespace
    let importNames = imports.split(',').map(name => name.trim());

    // Filter out the named imports that should be removed
    importNames = importNames.filter(name => !namedImportsToRemove.includes(name));

    // If no named imports remain, remove the entire import statement
    if (importNames.length === 0) {
      return '';
    }

    // Join the remaining imports back into a string
    const newImports = importNames.join(', ');

    // Return the modified import statement
    return `import { ${newImports} } from '${moduleName}';`;
  };

  // Replace the import statements in the code
  const newCode = code.replace(importRegex, replaceImport);

  // Remove empty lines that might have been left behind
  return newCode.replace(/^\s*[\r\n]/gm, '');
};

export const prettyPrintMessage = (message: string): string => {
  try {
    const parsedMessage = JSON.parse(message);
    return JSON.stringify(parsedMessage, null, 2);
  } catch (e) {
    return message;
  }
};

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
