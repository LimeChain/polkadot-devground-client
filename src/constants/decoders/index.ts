import type { IDecoders } from "@constants/decoders/types";

export const decoders: IDecoders = {
  'blockHeader': {
    params: [
      {
        name: 'Block Header',
        type: 'hex',
        description: 'SCALE-encoded block header'
      }
    ]
  },
  'extrinsics': {
    params: [
      {
        name: 'Extrinsics',
        type: 'array',
        arrayItemType: 'string',
        description: 'SCALE-encoded extrinsic'
      }
    ]
  },
  'metadata': {
    params: [
      {
        name: 'Metadata',
        type: 'hex',
        description: 'SCALE-encoded metadata'
      }
    ]
  }
}
