/* eslint-disable */
import Snippet1Code from './snippet1.txt?raw';
import Snippet2Code from './snippet2.txt?raw';
import Snippet3Code from './snippet3.txt?raw';
import Snippet4Code from './snippet4.txt?raw';
/* eslint-enable */

import type { ICodeSnippet } from '@custom-types/codeSnippet';
const snippet1: ICodeSnippet = {
  id: 1,
  name: 'Example 1',
  code: Snippet1Code,
};

const snippet2: ICodeSnippet = {
  id: 2,
  name: 'Example 2',
  code: Snippet2Code,
};

const snippet3: ICodeSnippet = {
  id: 3,
  name: 'Example 3',
  code: Snippet3Code,
};

const snippet4: ICodeSnippet = {
  id: 4,
  name: 'Example 4',
  code: Snippet4Code,
};

export const snippets = [
  snippet1,
  snippet2,
  snippet3,
  snippet4,
];
