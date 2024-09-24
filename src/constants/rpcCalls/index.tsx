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
    docs: [
      'Retrieves the body of a pinned block.',
    ],
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
    docs: [
      'Invoke the entry point of the runtime of the given block using the storage of the given block.',
    ],
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
    docs: [
      'Resumes a storage fetch started with chainHead_v1_storage after it has generated an operationWaitingForContinue event.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_continue.html',
  },
  'chainHead_v1_follow': {
    params: [
      {
        name: 'withRuntime',
        type: 'boolean',
      },
    ],
    docs: [
      'This functions lets the JSON-RPC client track the state of the head of the chain: the finalized, non-finalized, and best blocks.',
    ],
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
    docs: [
      'Retrieves the header of a pinned block.',
    ],
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
        options: ['value', 'hash', 'closestDescendantMerkleValue', 'descendantsValues', 'descendantsHashes'],
      },
      {
        name: 'key',
        type: 'hex',
        description: 'Storage key',
      },
    ],
    docs: [
      'Retrieves a storage key from a pinned block.',
    ],
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
    docs: [
      'Unpins an array of blocks.',
    ],
  },

  // CHAIN SPEC
  'chainSpec_v1_chainName': {
    params: [],
    docs: [
      'Returns a string containing the human-readable name of the chain.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_chainName.html',
  },
  'chainSpec_v1_genesisHash': {
    params: [],
    docs: [
      'Returns a string containing the hexadecimal-encoded hash of the header of the genesis block of the chain.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_genesisHash.html',
  },
  'chainSpec_v1_properties': {
    params: [],
    docs: [
      'Returns the JSON payload found in the chain specification under the key "properties". No guarantee is offered about the content of this object.',
    ],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_properties.html',
  },

  // RPC METHODS
  'rpc_methods': {
    params: [],
    docs: [
      'Returns the rpc methods supported.',
    ],
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
    docs: [
      'Propagate a transaction over the peer-to-peer network until transaction_v1_stop is called.',
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
    docs: [
      'The node will no longer try to broadcast the transaction over the peer-to-peer network.',
    ],
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
