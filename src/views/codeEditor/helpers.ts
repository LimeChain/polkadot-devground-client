import { setupTypeAcquisition } from '@typescript/ata';
import typescript from 'typescript';

export function setupAta(
  onDownloadFile?: (code: string, path: string) => void,
  onStarted?: () => void,
  onFinished?: (files: Map<string, string>) => void,
) {
  return setupTypeAcquisition({
    typescript,
    projectName: 'react-playground',
    delegate: {
      receivedFile: onDownloadFile,
      started: onStarted,
      finished: onFinished,
    },
  });
}

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
