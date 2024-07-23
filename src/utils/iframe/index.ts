import {
  deflate,
  inflate,
} from 'pako';
import { transform } from 'sucrase';

import iframe from './iframe.html?raw';

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

export const compressCode = (code: string): string => {
  const compressed = deflate(new TextEncoder().encode(code));
  return window.btoa(String.fromCharCode(...compressed));
};

export const encodeCodeToBase64 = (code: string): string => {
  return compressCode(code)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const getIframeContent = (script: string, importMap: string) => {
  return iframe.replace('<!-- IMPORT_MAP -->', importMap).replace('<!-- SCRIPT -->', script);
};

export const decompressCode = (compressed: string): string => {
  const decoded = Uint8Array.from(atob(compressed), c => c.charCodeAt(0));
  const decompressed = inflate(decoded, { to: 'string' });
  return decompressed;
};

export const decodeCodeFromBase64 = (base64: string): string | undefined => {
  try {
    const normalizedBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    return decompressCode(normalizedBase64);
  } catch (error) {
    return undefined;
  }
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

export const generateHTML = (code: string, importMap: string) => {
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

    const o = removeNamedImports(output.code, Object.keys(window.customPackages));

    html = getIframeContent(o, importMap);
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

  return html;
};

export const generateBlobUrl = (code: string, importMap: string) => {
  const html = generateHTML(code, importMap);
  const blobUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  return blobUrl;
};
