/* eslint-disable import/default */
import Snippet1Code from './snippet1.txt?raw';
import Snippet2Code from './snippet2.txt?raw';
import Snippet3Code from './snippet3.txt?raw';

import type { ICodeSnippet } from '@custom-types/codeSnippet';
// type ChainClient = 'polkadot' | 'rococo';

// const chainsLib: {
//   [key in ChainClient]: {
//     knownChain: string;
//     descriptor: string;
//   }
// } = {
//   polkadot: {
//     knownChain: 'polkadot', descriptor: 'dot',
//   },
//   rococo: { knownChain: 'rococo_v2_2', descriptor: 'rococo' },
// };

// const getCurrentChainId = (): ChainClient => {
//   // @todo make the snippets update dynamically when the chain is changed
//   // return baseStoreChain.getState()?.chain?.id;
//   return 'rococo';
// };

// const startChainClientImports = (): string => {
//   const chain = getCurrentChainId();
//   return `
//     import { start } from "polkadot-api/smoldot";
//     import { chainSpec } from "polkadot-api/chains/${chainsLib?.[chain]?.knownChain}";
//     import { getSmProvider } from "polkadot-api/sm-provider";
//   `.trim();
// };

// const startChainClient = (): string => {
//   const chain = getCurrentChainId();
//   return `
//     const smoldot = start();
//     const chain = await smoldot.addChain({ chainSpec });

//     const provider = getSmProvider(chain);
//     const client = createClient(provider);
//   `.trim();
// };

// const destroyChainClient = () => {
//   return `
//     client.destroy()
//   `.trim();
// };

const snippet1: ICodeSnippet = {
  id: 1,
  code: Snippet1Code,
};

const snippet2: ICodeSnippet = {
  id: 2,
  code: Snippet2Code,
};

const snippet3: ICodeSnippet = {
  id: 3,
  code: Snippet3Code,
};

const snippet4: ICodeSnippet = {
  id: 4,
  code: `
  import { create } from "@shined/reactive";
  import { createRoot } from "react-dom/client";
  import { useMouse, useDateFormat } from "@shined/react-use";

  const store = create({ count: 1, time: Date.now() });
  const addOne = () =>store.mutate.count++;
  const updateTime = () => (store.mutate.time = Date.now());

  setInterval(updateTime, 1000);

  const App = () => {
    const { x, y } = useMouse();
    const [count, time] = store.useSnapshot((s) => [s.count, s.time]);
    const formatted = useDateFormat(time, "YYYY/MM/DD HH:mm:ss");

    return (
      <div className="bg-blue-100 size-full">
        <div>
          (x, y): ({x}, {y})
        </div>
        <div>Time: {formatted}</div>
        <button onClick={addOne}>Count: {count}</button>
      </div>
    );
  };

  createRoot(document.getElementById("root")!).render(<App />);
  `,
};

export const snippets = [snippet1, snippet2, snippet3, snippet4];
