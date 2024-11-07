/* eslint-disable */
import TestAccountTransferSnippet from './testAccountTransfer.txt?raw';
import InjectedAccountTransferSnippet from './injectedAccountTransfer.txt?raw';
import ChainSubscriptionSnippet from './chainSubscription.txt?raw';
import GetChainSpecificDataSnippet from './getChainSpecificData.txt?raw';
import StarterExample from './starterExample.txt?raw';
/* eslint-enable */

import type { ICodeExample } from '@custom-types/codeSnippet';

const snippet1: ICodeExample = {
  id: '1',
  name: 'Starter example',
  description: 'This example demonstrates how to set up a basic Polkadot light client using Smoldot and fetch runtime metadata from the Westend test network.',
  code: StarterExample,
};

const snippet2: ICodeExample = {
  id: '2',
  name: 'Get chain specific data',
  description: 'This snippet demonstrates how to get chain specific data',
  code: GetChainSpecificDataSnippet,
};

const snippet3: ICodeExample = {
  id: '3',
  name: 'Balance transfer from an injected account',
  description: 'This snippet demonstrates how to transfer balance from an injected account',
  code: InjectedAccountTransferSnippet,
};

const snippet4: ICodeExample = {
  id: '4',
  name: 'Subscribe to chain data',
  description: 'This snippet demonstrates how to subscribe to chain data',
  code: ChainSubscriptionSnippet,
};

const snippet5: ICodeExample = {
  id: '5',
  name: 'Balance transfer from a test account',
  description: 'This snippet demonstrates how to transfer balance from a test account',
  code: TestAccountTransferSnippet,
};

export const snippets = [
  snippet1,
  snippet2,
  snippet3,
  snippet4,
  snippet5,
];
