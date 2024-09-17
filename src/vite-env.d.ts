/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import type * as papiDescriptors from '@polkadot-api/descriptors';
import type { JsonRpcProvider } from '@polkadot-api/json-rpc-provider';
import type { PolkadotClient } from 'polkadot-api';

declare global {
  interface Window {
    pivanov?: unknown; // for testing purposes
    PDStoreSizes: Record<string, number>;
    papiDescriptors: typeof papiDescriptors;
    pdCreateClient: (provider: JsonRpcProvider) => PolkadotClient;
    customPackages: Record<string, unknown>;
  }
}
