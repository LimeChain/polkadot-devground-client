export const STORAGE_CACHE_NAME = 'polkadot-devground-ide-cache';
export const STORAGE_PREFIX = 'tmp-example-index';
export const STORAGE_PREFIX_CONSOLE_OUTPUT = `${STORAGE_PREFIX}-console-output`;

export const defaultImportMap = {
  imports: {
    dayjs: 'https://esm.sh/dayjs',
    react: 'https://esm.sh/react',
    'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime',
    'react-dom/client': 'https://esm.sh/react-dom/client',
    '@shined/reactive': 'https://esm.sh/@shined/reactive',
    '@shined/react-use': 'https://esm.sh/@shined/react-use',
    'polkadot-api': 'https://esm.sh/polkadot-api@0.11.1',
    'polkadot-api/signer': 'https://esm.sh/polkadot-api@0.11.1/signer',
    'polkadot-api/chains/rococo_v2_2': 'https://esm.sh/polkadot-api@0.11.1/chains/rococo_v2_2',
    'polkadot-api/sm-provider': 'https://esm.sh/polkadot-api@0.11.1/sm-provider',
    'polkadot-api/smoldot': 'https://esm.sh/polkadot-api@0.11.1/smoldot',
    'polkadot-api/pjs-signer': 'https://esm.sh/polkadot-api@0.11.1/pjs-signer',
  },
  scopes: {},
};
