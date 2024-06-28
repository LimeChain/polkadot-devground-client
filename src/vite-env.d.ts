/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

import type * as dotDescriptor from '@polkadot-api/descriptors';

declare global {
  interface Window {
    pivanov?: unknown; // for testing purposes
    dotDescriptor: typeof dotDescriptor;
  }
}
