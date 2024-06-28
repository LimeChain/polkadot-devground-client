const snippet0 = {
  id: 0,
  code: `
    import { createClient } from "polkadot-api";
    import { WebSocketProvider } from "polkadot-api/ws-provider/web";
    import { getPolkadotSigner } from "polkadot-api/signer";
    import { sr25519CreateDerive } from '@polkadot-labs/hdkd';

    (async () => {
      try {
        const provider = WebSocketProvider("wss://rococo-rpc.polkadot.io");
        const client = createClient(provider);
        const dotApi = client.getTypedApi(dotDescriptor.dot);

        const myAddress = "5EFnjjDGnWfxVdFPFtbycHP9vew6JbpqGamDqcUg8qfP7tu7";
        const aliceAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
        const bobAddress = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

        const entropy = mnemonicToEntropy(DEV_PHRASE);
        const miniSecret = entropyToMiniSecret(entropy);
        const hdkdKeyPair = sr25519CreateDerive(miniSecret)("//Alice");
        const signer = getPolkadotSigner(
          hdkdKeyPair.publicKey,
          "Sr25519",
          (input) => hdkdKeyPair.sign(input)
        );

        const {data:{free}} = await dotApi.query.System.Account.getValue(aliceAddress);
        console.log(free);

        const tx = dotApi.tx.Balances.transfer_allow_death({
          dest: dotDescriptor.MultiAddress.Id(myAddress),
          value: free / 2n,
        })
          .signSubmitAndWatch(signer)
          .subscribe((d) => {
            console.log(d);
          });

      } catch (err) {
        console.log(err)
      }
    })();
    `,
};


const snippet1 = {
  id: 1,
  code: `
  import { ApiPromise, WsProvider } from '@polkadot/api';

  (async () => {
    const provider = new WsProvider('wss://dot-rpc.stakeworld.io');
    const api = await ApiPromise.create({ provider });

    // Subscribe to the latest block headers
    api.rpc.chain.subscribeFinalizedHeads((header) => {
      console.log(header.number.toNumber(), header.hash.toHex());
    });

    // Get the value for an account
    const accountInfo = await api.query.system.account('16JGzEsi8gcySKjpmxHVrkLTHdFHodRepEz8n244gNZpr9J');

    console.log('@@@ accountInfo', accountInfo);
  })();
  `,
};

const snippet2 = {
  id: 2,
  code: `
  import { ApiPromise, WsProvider } from '@polkadot/api';

  (async () => {
    const provider = new WsProvider('wss://dot-rpc.stakeworld.io');
    const api = await ApiPromise.create({ provider });
    const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';

    // retrieve the balance, once-off at the latest block
    const { data: { free } } = await api.query.system.account(ALICE);

    console.log('Alice has a current balance of', free.toHuman());

    // retrieve balance updates with an optional value callback
    const balanceUnsub = await api.query.system.account(ALICE, ({ data: { free } }) => {
      console.log('Alice has an updated balance of', free.toHuman());
    });

    // retrieve the balance at a block hash in the past
    const header = await api.rpc.chain.getHeader();
    const prevHash = await api.rpc.chain.getBlockHash(header.number.unwrap().subn(42));
    const { data: { free: prev } } = await api.query.system.account.at(prevHash, ALICE);

    console.log('Alice had a balance of', prev.toHuman(), '(42 blocks ago)');

    // useful in some situations - the value hash and storage entry size
    const currHash = await api.query.system.account.hash(ALICE);
    const currSize = await api.query.system.account.size(ALICE);

    console.log('Alice account entry has a value hash of', currHash, 'with a size of', currSize);
  })();
  `,
};

const snippet3 = {
  id: 3,
  code: `
    import { createClient } from "polkadot-api";
    import { WebSocketProvider } from "polkadot-api/ws-provider/web";

    (async () => {
      // Connect to the polkadot relay chain.
      const client = createClient(
        WebSocketProvider("wss://dot-rpc.stakeworld.io")
      );

      // To interact with the chain, you need to get the "TypedApi", which includes
      // all the types for every call in that chain:
      const dotApi = client.getTypedApi(dotDescriptor.dot);

      console.log(Object.keys(dotApi.query.System.Account));

      try {
        // get the value for an account
        const accountInfo = await dotApi.query.System.Account.watchValue(
          "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        );
        console.log('accountInfo', accountInfo);
      } catch (e) {
        console.log(e);
      }

      // With the "client", you can get information such as subscribing to the last
      // block to get the latest hash:
      client.finalizedBlock$.subscribe((finalizedBlock) =>
        console.log(finalizedBlock.number, finalizedBlock.hash),
      );
    })();
  `,
};

const snippet4 = {
  id: 4,
  code: `
    import { createClient } from "polkadot-api";
    import { WebSocketProvider } from "polkadot-api/ws-provider/web";
    import { getPolkadotSigner } from "polkadot-api/signer";
    import { sr25519CreateDerive } from '@polkadot-labs/hdkd';


    (async () => {
      try {

        const provider = WebSocketProvider("wss://rococo-rpc.polkadot.io");
        const client = createClient(provider);
        const dotApi = client.getTypedApi(dotDescriptor.dot);

        const myAddress = "5EFnjjDGnWfxVdFPFtbycHP9vew6JbpqGamDqcUg8qfP7tu7";
        const aliceAddress = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
        const bobAddress = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

        const {data:{free}} = await dotApi.query.System.Account.getValue(aliceAddress);

        const tx = dotApi.tx.Balances.transfer_allow_death({
          dest: dotDescriptor.MultiAddress.Id(myAddress),
          value: free / 2n,
        }).signSubmitAndWatch(signer)
          .subscribe((d) => {
            console.log(d);
          });
       
      } catch (err) {
        console.log(err)
      }
    })();
    `,
};
export const demoCodes = [snippet4,snippet0, snippet1, snippet2, snippet3];