import type { IRpcCalls } from './types';

export const newRpcCalls: IRpcCalls = {
  // CHAIN HEAD
  'chainHead_v1_body': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        readOnly: true,
        description: 'Managed by PAPI',
      },
      {
        name: 'hash',
        type: 'hex',
        description: 'Block Hash',
      },
    ],
    docs: ['Retrieves the body of a pinned block.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_body.html',
  },
  'chainHead_v1_call': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        readOnly: true,
        description: 'Managed by PAPI',
      },
      {
        name: 'hash',
        type: 'hex',
        description: 'Block Hash',
      },
      {
        name: 'fnName',
        type: 'string',
        description: 'Runtime entry point to call',
      },
      {
        name: 'callParameters',
        type: 'hex',
        description: 'Hex-encoded SCALE-encoded value to pass as input',
      },
    ],
    docs: ['Invoke the entry point of the runtime of the given block using the storage of the given block.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_call.html',
  },
  'chainHead_v1_continue': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        description: 'string',
      },
      {
        name: 'operationId',
        type: 'string',
        description: 'string',
      },
    ],
    docs: ['Resumes a storage fetch started with chainHead_v1_storage after it has generated an operationWaitingForContinue event.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_continue.html',
  },
  'chainHead_v1_follow': {
    params: [
      {
        name: 'withRuntime',
        type: 'boolean',
      },
    ],
    docs: ['This functions lets the JSON-RPC client track the state of the head of the chain: the finalized, non-finalized, and best blocks.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_follow.html',
  },
  'chainHead_v1_header': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        readOnly: true,
        description: 'Managed by PAPI',
      },
      {
        name: 'hash',
        type: 'hex',
        description: 'Block Hash',
      },
    ],
    docs: ['Retrieves the header of a pinned block.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_header.html',
  },
  'chainHead_v1_stopOperation': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        description: 'string',
      },
      {
        name: 'operationId',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Stops an operation started with chainHead_v1_body, chainHead_v1_call, or chainHead_v1_storage.',
      'If the operation was still in progress, this interrupts it.',
      'If the operation was already finished, this call has no effect.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_stopOperation.html',
  },
  'chainHead_v1_storage': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        readOnly: true,
        description: 'Managed by PAPI',
      },
      {
        name: 'hash',
        type: 'hex',
        description: 'Block Hash',
      },
      {
        name: 'type',
        type: 'select',
        options: [
          'value',
          'hash',
          'closestDescendantMerkleValue',
          'descendantsValues',
          'descendantsHashes',
        ],
      },
      {
        name: 'key',
        type: 'hex',
        description: 'Storage key',
      },
    ],
    docs: ['Retrieves a storage key from a pinned block.'],
  },
  'chainHead_v1_unfollow': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Stops a subscription started with chainHead_v1_follow.',
      'Has no effect if the followSubscription is invalid or refers to a subscription that has already emitted a {"event": "stop"} event.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_unfollow.html',
  },
  'chainHead_v1_unpin': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        readOnly: true,
        description: 'Managed by PAPI',
      },
      {
        name: 'Block Hashes',
        type: 'array',
        arrayItemType: 'string',
        description: 'Block Hash',
      },
    ],
    docs: ['Unpins an array of blocks.'],
  },

  // CHAIN SPEC
  'chainSpec_v1_chainName': {
    params: [],
    docs: ['Returns a string containing the human-readable name of the chain.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_chainName.html',
  },
  'chainSpec_v1_genesisHash': {
    params: [],
    docs: ['Returns a string containing the hexadecimal-encoded hash of the header of the genesis block of the chain.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_genesisHash.html',
  },
  'chainSpec_v1_properties': {
    params: [],
    docs: ['Returns the JSON payload found in the chain specification under the key "properties". No guarantee is offered about the content of this object.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_properties.html',
  },

  // RPC METHODS
  'rpc_methods': {
    params: [],
    docs: ['Returns the supported rpc methods.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/rpc_methods.html',
  },

  // TRANSACTION
  'transaction_v1_broadcast': {
    params: [
      {
        name: 'transaction',
        type: 'hex',
        description: 'SCALE-encoded transaction to try to include in a block',
      },
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/transaction_v1_broadcast.html',
  },
  'transaction_v1_stop': {
    params: [
      {
        name: 'operationId',
        type: 'string',
        description: 'string',
      },
    ],
    docs: ['The node will no longer try to broadcast the transaction over the peer-to-peer network.'],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/transaction_v1_stop.html',
  },

  // TRANSACTION WATCH
  'transactionWatch_v1_submitAndWatch': {
    params: [
      {
        name: 'transaction',
        type: 'hex',
        description: 'SCALE-encoded transaction to try to include in a block',
      },
    ],
    docs: [
      'Propagate a transaction over the peer-to-peer network and/or include it onto the chain even if transactionWatch_v1_unwatch is called or if the JSON-RPC client disconnects.',
      'It is not possible to cancel this kind of transaction.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/transactionWatch_v1_submitAndWatch.html',
  },
  'transactionWatch_v1_unwatch': {
    params: [
      {
        name: 'subscription',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'This function does not remove the transaction from the pool.',
      'In other words, the node will still try to include the transaction in the chain. Having a function that removes the transaction from the pool would be almost useless, as the node might have already gossiped it to the rest of the network.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/transactionWatch_v1_unwatch.html',
  },
};

export const oldRpcCalls: IRpcCalls = {
  // SYSTEM
  'system_name': {
    params: [],
    docs: ['Get the node\'s implementation name.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#152-system_name',
  },
  'system_version': {
    params: [],
    docs: ['Get the node implementation\'s version. Should be a semantic versioning string.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#153-system_version',
  },
  'system_chain': {
    params: [],
    docs: ['Get the chain\'s type. Given as a string identifier.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#154-system_chain',
  },
  'system_chainType': {
    params: [],
    docs: ['Get the chain\'s type.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#155-system_chaintype',
  },
  'system_properties': {
    params: [],
    docs: ['Get a custom set of properties as a JSON object, defined in the chain specification.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#156-system_properties',
  },
  'system_health': {
    params: [],
    docs: ['Return health status of the node.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#157-system_health',
  },
  'system_localPeerId': {
    params: [],
    docs: ['Returns the base58-encoded PeerId fo the node.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#158-system_localpeerid',
  },
  'system_localListenAddresses': {
    params: [],
    docs: ['Returns the libp2p multiaddresses that the local node is listening on.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#159-system_locallistenaddresses',
  },
  'system_peers': {
    params: [],
    docs: ['Returns currently connected peers.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1510-system_peers',
  },
  'system_addReservedPeer': {
    params: [
      {
        name: 'Multiaddr',
        type: 'string',
        description: 'encoded p2p multiaddr',
      },
    ],
    docs: ['Adds a reserved peer. The string parameter should encode a p2p multiaddr.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1512-system_addreservedpeer',
  },
  'system_nodeRoles': {
    params: [],
    docs: ['Returns the roles the node is running as.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1514-system_noderoles',
  },
  'system_syncState': {
    params: [],
    docs: ['Returns the state of the syncing of the node.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1515-system_syncstate',
  },
  'system_accountNextIndex': {
    params: [
      {
        name: 'Account address',
        type: 'string',
        description: 'The address of the account.',
      },
    ],
    docs: [
      'Returns the next valid index (aka. nonce) for given account.',
      'This method takes into consideration all pending transactions currently in the pool and if no transactions are found in the pool it fallbacks to query the index from the runtime (aka. state nonce).',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1516-system_accountnextindex',
  },
  'system_dryRun': {
    params: [
      {
        name: 'Extrinsic',
        type: 'hex',
        description: 'The raw, SCALE-encoded extrinsic.',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'The block hash indicating the state. Null implies the current state.',
        optional: true,
      },
    ],
    docs: ['Dry run an extrinsic. Returns a SCALE encoded "ApplyExtrinsicResult".'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1517-system_dryrun',
  },

  // BABE
  'babe_epochAuthorship': {
    params: [],
    docs: [
      'Returns data about which slots (primary or secondary) can be claimed in the current epoch with the key in the keystore.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#161-babe_epochauthorship',
  },

  // GRANDPA
  'grandpa_roundState': {
    params: [],
    docs: ['Returns the state of the current best round state as well as the ongoing background rounds.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#171-grandpa_roundstate',
  },
  'grandpa_proveFinality': {
    params: [
      {
        name: 'Block Hash - beginning',
        type: 'hex',
        description: 'The block hash indicating the beginning of the range.',
      },
      {
        name: 'Block Hash - ending',
        type: 'hex',
        description: 'The block hash indicating the ending of the range.',
      },
      {
        name: 'Authority Set ID',
        type: 'number',
        primitiveType: 'u64',
        optional: true,
      },
    ],
    docs: [
      'Prove finality for the provided block range.',
      'Returns NULL if there are no known finalized blocks in the range. If no authorities set is provided, the current one will be attempted.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#172-grandpa_provefinality',
  },
  'grandpa_subscribeJustifications': {
    params: [],
    docs: [
      'Returns the block most recently finalized by Grandpa, alongside side its justification.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#173-grandpa_subscribejustifications-pubsub',
  },
  'grandpa_unsubscribeJustifications': {
    params: [
      {
        name: 'Subscription Id',
        type: 'string',
        description: 'string',
      },
    ],
    docs: ['Unsubscribe from justification watching.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#174-grandpa_unsubscribejustifications-pubsub',
  },

  // AUTHOR
  'author_submitExtrinsic': {
    params: [
      {
        name: 'Extrinsic',
        type: 'string',
        description: 'SCALE-encoded extrinsic to try to include in a block',
      },
    ],
    docs: ['Submit an extrinsic for inclusion into a block.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#182-author_submitextrinsic',
  },
  'author_pendingExtrinsics': {
    params: [],
    docs: ['Returns all pending extrinsics, potentially grouped by sender.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#183-author_pendingextrinsics',
  },
  'author_removeExtrinsic': {
    params: [
      {
        name: 'Extrinsics',
        type: 'array',
        description: 'Extrinsic hash',
        arrayItemType: 'string',
      },
    ],
    docs: ['Remove given extrinsic from the pool and temporarily ban it to prevent reimporting.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#184-author_removeextrinsic',
  },
  'author_insertKey': {
    params: [
      {
        name: 'Key type',
        type: 'select',
        description: 'string',
        options: ['babe', 'gran', 'acco', 'aura', 'imon', 'audi', 'dumy'],
      },
      {
        name: 'Seed',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Public key',
        type: 'hex',
        description: 'hex',
      },
    ],
    docs: ['Insert a key into the keystore.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#185-author_insertkey',
  },
  'author_rotateKeys': {
    params: [],
    docs: ['Generate new session keys and returns the corresponding public keys.'],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#186-author_rotatekeys',
  },
  'author_hasSessionKeys': {
    params: [
      {
        name: 'Keys',
        type: 'hex',
        description: 'The SCALE encoded, concatenated keys.',
      },
    ],
    docs: [
      'Checks if the keystore has private keys for the given session public keys.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#187-author_hassessionkeys',
  },
  'author_hasKey': {
    params: [
      {
        name: 'Public key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Key type',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Checks if the keystore has private keys for the given public key and key type.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#188-author_haskey',
  },
  'author_submitAndWatchExtrinsic': {
    params: [
      {
        name: 'Extrinsic',
        type: 'hex',
        description: 'The SCALE-encoded extrinsic.',
      },
    ],
    docs: [
      'Submit an extrinsic and watch.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#189-author_submitandwatchextrinsic-pubsub',
  },
  'author_unwatchExtrinsic': {
    params: [
      {
        name: 'Sibscriber ID',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Unsubscribe from watching an extrinsic.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1810-author_unwatchextrinsic-pubsub',
  },

  // CHAIN
  'chain_getHeader': {
    params: [
      {
        name: 'Block hash',
        type: 'hex',
        description: 'Hex encoded block hash',
        optional: true,
      },
    ],
    docs: [
      'Get header of a relay chain block. If no block hash is provided, the latest block header will be returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#192-chain_getheader',
  },
  'chain_getBlock': {
    params: [
      {
        name: 'Block hash',
        type: 'hex',
        description: 'Hex encoded block hash',
        optional: true,
      },
    ],
    docs: [
      'Get header and body of a relay chain block. If no block hash is provided, the latest block body will be returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#193-chain_getblock',
  },
  'chain_getBlockHash': {
    params: [
      {
        name: 'Block number',
        type: 'number',
        description: 'The value indicating the "n-th" block in the chain.',
        primitiveType: 'u32',
        optional: true,
      },
    ],
    docs: [
      'Get hash of the "n-th" block in the canon chain.',
      'If no parameters are provided, the latest block hash gets returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#194-chain_getblockhash',
  },
  'chain_getFinalizedHead': {
    params: [],
    docs: [
      'Get hash of the last finalized block in the canon chain.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#195-chain_getfinalizedhead',
  },
  'chain_subscribeAllHeads': {
    params: [],
    docs: [
      'Subscription for all block headers (new blocks and finalized blocks).',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#196-chain_subscribeallheads-pubsub',
  },
  'chain_unsubscribeAllHeads': {
    params: [
      {
        name: 'Subscription ID',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Unsubscribe from watching all block headers.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#197-chain_unsubscribeallheads-pubsub',
  },
  'chain_subscribeFinalizedHeads': {
    params: [],
    docs: [
      'Subscription for finalized block headers.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1910-chain_subscribefinalizedheads-pubsub',
  },
  'chain_unsubscribeFinalizedHeads': {
    params: [
      {
        name: 'Subscription ID',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Unsubscribe from watching finalized block headers.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1911-chain_unsubscribefinalizedheads-pubsub',
  },

  // OFCHAIN
  'offchain_localStorageSet': {
    params: [
      {
        name: 'Storage kind',
        type: 'select',
        options: ['PERSISTENT', 'LOCAL'],
      },
      {
        name: 'Key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Value',
        type: 'hex',
        description: 'hex',
      },
    ],
    docs: [
      'Set offchain local storage under given key and prefix.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1103-offchain_localstorageset',
  },
  'offchain_localStorageGet': {
    params: [
      {
        name: 'Storage kind',
        type: 'select',
        options: ['PERSISTENT', 'LOCAL'],
      },
      {
        name: 'Key',
        type: 'hex',
        description: 'hex',
      },
    ],
    docs: [
      'Get offchain local storage under given key and prefix.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1104-offchain_localstorageget',
  },

  // STATE
  'state_getPairs': {
    params: [
      {
        name: 'Prefix',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the keys with prefix, leave empty to get all the keys.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1114-state_getpairs',
  },
  'state_getKeysPaged': {
    params: [
      {
        name: 'Prefix',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
      {
        name: 'Amount of keys',
        type: 'number',
        primitiveType: 'u32',
      },
      {
        name: 'The storage key after which to return',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the keys with prefix with pagination support.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1115-state_getkeyspaged',
  },
  'state_getStorage': {
    params: [
      {
        name: 'Storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns a storage entry at a specific block\'s state.',
      'If no block hash is provided, the latest value is returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1115-state_getkeyspaged',
  },
  'state_getStorageHash': {
    params: [
      {
        name: 'Storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the hash of a storage entry at a block\'s state. If no block hash is provided, the latest value is returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1117-state_getstoragehash',
  },
  'state_getStorageSize': {
    params: [
      {
        name: 'Storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the size of a storage entry at a block\'s state. If no block hash is provided, the latest value is used.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1118-state_getstoragesize',
  },
  'state_getMetadata': {
    params: [
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the runtime metadata.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1119-state_getmetadata',
  },
  'state_getRuntimeVersion': {
    params: [
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Get the runtime version at a given block. If no block hash is provided, the latest version gets returned.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11110-state_getruntimeversion',
  },
  'state_queryStorage': {
    params: [
      {
        name: 'Storage keys',
        type: 'array',
        arrayItemType: 'string',
        description: 'Storage key',
      },
      {
        name: 'From Block hash',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'To Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Query historical storage entries (by key) starting from a block given as the second parameter.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11111-state_querystorage',
  },
  'state_getReadProof': {
    params: [
      {
        name: 'Storage keys',
        type: 'array',
        arrayItemType: 'string',
        description: 'Storage key',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the proof of storage entries.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11112-state_getreadproof',
  },
  'state_subscribeRuntimeVersion': {
    params: [],
    docs: [
      'Runtime version subscription. Creates a message for current version and each upgrade.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11113-state_subscriberuntimeversion-pubsub',
  },
  'state_unsubscribeRuntimeVersion': {
    params: [
      {
        name: 'Subscription ID',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Unsubscribe from watching the runtime version.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11114-state_unsubscriberuntimeversion-pubsub',
  },
  'state_subscribeStorage': {
    params: [
      {
        name: 'Storage keys',
        type: 'array',
        arrayItemType: 'string',
        description: 'Storage key',
        optional: true,
      },
    ],
    docs: [
      'Storage subscription. If storage keys are specified, it creates a message for each block which changes the specified storage keys. If none are specified, then it creates a message for every block.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11115-state_subscribestorage-pubsub',
  },
  'state_unsubscribeStorage': {
    params: [
      {
        name: 'Subscription ID',
        type: 'string',
        description: 'string',
      },
    ],
    docs: [
      'Unsubscribe from watching storage.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#11116-state_unsubscribestorage-pubsub',
  },

  // CHILD STATE
  'childstate_getKeys': {
    params: [
      {
        name: 'Child storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Key prefix',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the keys from the specified child storage. The keys can also be filtered based on a prefix.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1121-childstate_getkeys',
  },
  'childstate_getStorage': {
    params: [
      {
        name: 'Child storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns a child storage entry.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1122-childstate_getstorage',
  },
  'childstate_getStorageHash': {
    params: [
      {
        name: 'Child storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the hash of a child storage entry.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1123-childstate_getstoragehash',
  },
  'childstate_getStorageSize': {
    params: [
      {
        name: 'Child storage key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Key',
        type: 'hex',
        description: 'hex',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Returns the size of a child storage entry.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1124-childstate_getstoragesize',
  },

  // PAYMENT
  'payment_queryInfo': {
    params: [
      {
        name: 'Transaction',
        type: 'hex',
        description: 'SCALE-encoded transaction to try to include in a block',
      },
      {
        name: 'Block hash',
        type: 'hex',
        description: 'hex',
        optional: true,
      },
    ],
    docs: [
      'Query the known data about the fee of an extrinsic at the given block. This value can be determined by calling the TransactionPaymentApi_query_info runtime method, which is specified in Appendix E.3.12.1 of The Polkadot Host Protocol Specification.',
      'This method cannot be aware of the internals of an extension, for example a tip. It only interprets the extrinsic as some encoded value and accounts for its weight and length, the runtime\'s extrinsic base weight, and the current fee multiplier.',
    ],
    link: 'https://github.com/w3f/PSPs/blob/master/PSPs/drafts/psp-6.md#1142-payment_queryinfo',
  },
};
