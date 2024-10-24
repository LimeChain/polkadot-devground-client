/* eslint-disable */
import TestAccountTransferSnippet from './testAccountTransfer.txt?raw';
import InjectedAccountTransferSnippet from './injectedAccountTransfer.txt?raw';
import ChainSubscriptionSnippet from './chainSubscription.txt?raw';
import GetChainSpecificDataSnippet from './getChainSpecificData.txt?raw';
/* eslint-enable */

import type { ICodeExample } from '@custom-types/codeSnippet';
const snippet1: ICodeExample = {
  id: '1',
  name: 'Balance transfer from a test account',
  description: 'This snippet demonstrates how to transfer balance from a test account',
  code: TestAccountTransferSnippet,
};

const snippet2: ICodeExample = {
  id: '2',
  name: 'Balance transfer from an injected account',
  description: 'This snippet demonstrates how to transfer balance from an injected account',
  code: InjectedAccountTransferSnippet,
};

const snippet3: ICodeExample = {
  id: '3',
  name: 'Subscribe to chain data',
  description: 'This snippet demonstrates how to subscribe to chain data',
  code: ChainSubscriptionSnippet,
};

const snippet4: ICodeExample = {
  id: '4',
  name: 'Get chain specific data',
  description: 'This snippet demonstrates how to get chain specific data',
  code: GetChainSpecificDataSnippet,
};

export const snippets = [
  snippet1,
  snippet2,
  snippet3,
  snippet4,
];
