export const STORAGE_CACHE_NAME = 'polkadot-devground-ide-cache';
export const STORAGE_PREFIX = 'tmp-example-index';
export const STORAGE_PREFIX_CONSOLE_OUTPUT = `${STORAGE_PREFIX}-console-output`;

export const iframeImports = `
  import { ApiPromise, WsProvider } from 'https://cdn.jsdelivr.net/npm/@polkadot/api@11.3.1/+esm';
  import { createClient } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.1/+esm'
  import { getSmProvider } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.1/sm-provider/+esm';
  import { start } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.1/smoldot/+esm';

  import * as polkadotApiknownChains from 'https://cdn.jsdelivr.net/npm/@polkadot-api/known-chains@0.1.6/+esm'

  import { WebSocketProvider } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.1/ws-provider/web/+esm';
  import { startFromWorker } from 'https://cdn.jsdelivr.net/npm/polkadot-api@0.9.1/smoldot/from-worker/+esm';

  import { getPolkadotSigner } from 'https://cdn.jsdelivr.net/npm/@polkadot-api/signer@0.0.1/+esm';
  import { DEV_PHRASE, entropyToMiniSecret, mnemonicToEntropy, ss58Address } from 'https://cdn.jsdelivr.net/npm/@polkadot-labs/hdkd-helpers@0.0.6/+esm';
  import { sr25519CreateDerive } from 'https://cdn.jsdelivr.net/npm/@polkadot-labs/hdkd@0.0.6/+esm';
  import { getInjectedExtensions, connectInjectedExtension } from "https://cdn.jsdelivr.net/npm/@polkadot-api/pjs-signer@0.2.0/+esm";

  const papiDescriptors = window.parent.papiDescriptors;
  window.injectedWeb3 = window.parent.injectedWeb3;
`;

export const defaultImportMap = {
  imports: {
    dayjs: 'https://esm.sh/dayjs',
    react: 'https://esm.sh/react',
    'react/jsx-runtime': 'https://esm.sh/react/jsx-runtime',
    'react-dom/client': 'https://esm.sh/react-dom/client',
    '@shined/reactive': 'https://esm.sh/@shined/reactive',
    '@shined/react-use': 'https://esm.sh/@shined/react-use',
  },
  scopes: {},
};
