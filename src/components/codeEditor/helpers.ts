import * as AT_POLKADOT_SLASH_API from '@polkadot/api';
import * as POLKADOT_API from 'polkadot-api';
import * as PA_CHAINS_POLKADOT from 'polkadot-api/chains/polkadot';
import * as POLKADOT_API_WS_PROVIDER_WEB from 'polkadot-api/ws-provider/web';
// eslint-disable-next-line import/default
import prettierPluginEstree from 'prettier/plugins/estree';
import parserTypeScript from 'prettier/plugins/typescript';
import { format } from 'prettier/standalone';

type PackageModule = {
  [key: string]: unknown;
};

interface IPackageType {
  [key: string]: PackageModule;
}

const packages: IPackageType = {
  '@polkadot/api': AT_POLKADOT_SLASH_API,
  'polkadot-api': POLKADOT_API,
  'polkadot-api/chains/polkadot': PA_CHAINS_POLKADOT,
  'polkadot-api/ws-provider/web': POLKADOT_API_WS_PROVIDER_WEB,
};

export const parseImports = (code: string): string[] | null => {
  const importRegex = /import\s+{[^}]+}\s+from\s+['"][^'"]+['"]/g;
  return code.match(importRegex);
};

export const prepareDeclarations = (
  imports: string[],
  packages: IPackageType,
): string => {
  const uniquePaths = new Set<string>();

  imports.forEach((importStatement) => {
    const match = importStatement.match(
      /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/,
    );
    if (match) {
      uniquePaths.add(match[2].trim());
    }
  });

  return Array.from(uniquePaths)
    .map((path) => {
      if (!(path in packages)) {
        console.warn(`Package path ${path} not found in packages.`);
        return '';
      }
      const keys = Object.keys(packages[path] as PackageModule);
      return `declare module '${path}' {\n  export { ${keys.join(', ')} } from '${path}';\n}`;
    })
    .join('\n');
};

export const prepareComments = (
  imports: string[],
  packages: IPackageType,
): string => {
  const uniquePaths = new Set<string>();

  const availableImports = imports
    .map((importStatement) => {
      const match = importStatement.match(
        /import\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/,
      );
      if (match) {
        const path = match[2].trim();
        uniquePaths.add(path);
        if (!(path in packages)) {
          console.warn(`Package path ${path} not found in packages.`);
        }
        const keys = Object.keys(packages[path] as PackageModule);
        return `import { ${keys.join(', ')} } from "${path}";`;
      }
    })
    .filter(Boolean);

  if (availableImports.length) {
    return `
      /* Available imports and packages */
      /*
       * ${availableImports.join('\n * ')}
       */\n
    `;
  }

  return '';
};

interface IOutput {
  types: string;
  code: string;
}

export const generateOutput = async (
  snippet: string,
  skipFormat = false,
): Promise<IOutput> => {
  const imports = parseImports(snippet);
  if (!imports) {
    throw new Error('No imports found in the provided code.');
  }
  const types = prepareDeclarations(imports, packages);
  const comments = prepareComments(imports, packages);

  try {
    let code = snippet;
    if (!skipFormat) {
      code = await format(`${comments}\n\n${snippet}`, {
        parser: 'typescript',
        plugins: [parserTypeScript, prettierPluginEstree],
        semi: true,
        singleQuote: false,
        trailingComma: 'all',
        bracketSpacing: true,
        arrowParens: 'always',
      });
    }

    return {
      types,
      code,
    };
  } catch (error) {
    console.error('Error formatting code:', error);
    throw new Error('Error formatting code');
  }
};
