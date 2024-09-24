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
    value: 'blockHeader',
    docs: [],
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
    value: 'Runtime Call',
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
    value: 'null',
    docs: [],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainHead_v1_continue.html',
  },
  'chainHead_v1_follow': {
    params: [
      {
        name: 'withRuntime',
        type: 'boolean',
      },
    ],
    value: 'followSubscription',
    docs: [],
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
    value: 'blockHeader',
    docs: [],
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
    value: 'null',
    docs: [],
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
    value: 'Storage',
  },
  'chainHead_v1_unfollow': {
    params: [
      {
        name: 'followSubscription',
        type: 'string',
        description: 'string',
      },
    ],
    value: 'null',
    docs: [],
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
    value: 'Unpin',
  },

  // CHAIN SPEC
  'chainSpec_v1_chainName': {
    params: [],
    value: 'Chain Name',
    docs: [],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_chainName.html',
  },
  'chainSpec_v1_genesisHash': {
    params: [],
    value: 'Genesis Hash',
    docs: [],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_genesisHash.html',
  },
  'chainSpec_v1_properties': {
    params: [],
    value: 'Properties',
    docs: [],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/chainSpec_v1_properties.html',
  },

  // RPC METHODS
  'rpc_methods': {
    params: [],
    value: 'Rpc Methods',
    docs: [],
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
    value: '',
    docs: [],
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
    value: 'null',
    docs: [],
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
    value: 'subscription string',
    docs: [],
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
    value: 'null',
    docs: [],
    link: 'https://paritytech.github.io/json-rpc-interface-spec/api/transactionWatch_v1_unwatch.html',
  },
};
