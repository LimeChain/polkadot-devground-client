/* eslint-disable */
import TestAccountTransferSnippet from './testAccountTransfer.txt?raw';
import InjectedAccountTransferSnippet from './injectedAccountTransfer.txt?raw';
import ChainSubscriptionSnippet from './chainSubscription.txt?raw';
import GetChainSpecificDataSnippet from './getChainSpecificData.txt?raw';
/* eslint-enable */

import type { ICodeSnippet } from '@custom-types/codeSnippet';
const snippet1: ICodeSnippet = {
  id: 1,
  name: 'Balance transfer from a test account',
  code: TestAccountTransferSnippet,
};

const snippet2: ICodeSnippet = {
  id: 2,
  name: 'Balance transfer from an injected account',
  code: InjectedAccountTransferSnippet,
};

const snippet3: ICodeSnippet = {
  id: 3,
  name: 'Subscribe to chain data',
  code: ChainSubscriptionSnippet,
};

const snippet4: ICodeSnippet = {
  id: 4,
  name: 'Get chain specific data',
  code: GetChainSpecificDataSnippet,
};

export const snippets = [
  snippet1,
  snippet2,
  snippet3,
  snippet4,
];
