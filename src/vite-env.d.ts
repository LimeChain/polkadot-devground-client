/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import type * as papiDescriptors from '@polkadot-api/descriptors';
import type { JsonRpcProvider } from '@polkadot-api/json-rpc-provider';
import type { PolkadotClient } from 'polkadot-api';

declare global {
  interface Window {
    pivanov?: unknown; // for testing purposes
    papiDescriptors: typeof papiDescriptors;
    pdCreateClient: (provider: JsonRpcProvider) => PolkadotClient;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    customPackages: Record<string, any>;
  }
}
