import type { InvocationDecoderArgs } from '@constants/decoders/types';
import type { IRpcArg } from '@constants/rpcCalls/types';
import type {
  TMetaDataApiMethod,
  TMetaDataCallBuilder,
  TMetaDataPallet,
  TMetaDataStorageItem,
} from '@custom-types/papi';
import type {
  AccountId20,
  AccountId32,
  ArrayVar,
  CompactVar,
  EnumVar,
  OptionVar,
  PrimitiveVar,
  SequenceVar,
  StructVar,
  TupleVar,
  Var,
} from '@polkadot-api/metadata-builders';
import type { InjectedPolkadotAccount } from 'polkadot-api/dist/reexports/pjs-signer';

export interface InvocationOnChangeProps {
  onChange: (args: unknown) => void;
}

export interface InvocationOnChangeWithIndexProps {
  onChange: (index: number, args: unknown) => void;
}

export interface InvocationStorageArgs extends InvocationOnChangeProps {
  args: TMetaDataStorageItem;
}

export interface InvocationMapperProps extends InvocationOnChangeProps {
  invokationVar: Var;
  placeholder?: string;
}
export interface InvocationRpcArgs extends InvocationOnChangeWithIndexProps {
  rpcs: IRpcArg[];
}

export interface InvocationRpcArg extends InvocationOnChangeProps {
  rpc: IRpcArg;
  placeholder?: string;
  readOnly?: boolean;
}

export interface InvocationRuntimeArgs extends InvocationOnChangeProps {
  runtimeMethod: TMetaDataApiMethod;
}

export interface InvocationArgsMapper extends InvocationOnChangeProps {
  pallet: TMetaDataPallet;
  name: string;
  invocationVar: TMetaDataCallBuilder;
}

export interface InvocationDecoder extends InvocationOnChangeWithIndexProps {
  fields: InvocationDecoderArgs[];
}

export interface IDecoderBuilderProps extends InvocationOnChangeProps {
  decoder: InvocationDecoderArgs;
  placeholder?: string;
  readOnly?: boolean;
}

export interface InvocationDecoderDynamic extends InvocationOnChangeProps { }

export interface IBitstreamBuilder extends InvocationOnChangeProps {
  minLength: number;
  placeholder?: string;
  readOnly?: boolean;
}
export interface IArrayVarBuilder extends InvocationOnChangeProps {
  data: ArrayVar;
}
export interface ICompactBuilder extends InvocationOnChangeProps {
  compact: CompactVar;
}
export interface IStructBuilder extends InvocationOnChangeProps {
  struct: StructVar;
}

export interface StructArgs {
  key: string;
  value: unknown;
}

export interface ICustomAccount extends InvocationOnChangeProps {
  accountId: AccountId20 | AccountId32;
}

export interface IAccountBuilder extends InvocationOnChangeProps {
  accountId: AccountId20 | AccountId32;
}

export interface IAccountSelectBuilder extends InvocationOnChangeProps {
  accounts: InjectedPolkadotAccount[];
}
export interface ITupleBuilder extends InvocationOnChangeProps {
  tuple: TupleVar;
}

export interface ISequenceBuilder extends InvocationOnChangeProps {
  sequence: SequenceVar;
  placeholder?: string;
}

export interface IPrimitiveBuilder extends InvocationOnChangeProps {
  primitive: PrimitiveVar;
  placeholder?: string;
  readOnly?: boolean;
}

export interface IConditionalBuilder extends InvocationOnChangeProps {
  condition: OptionVar;
}

export interface IEnumBuilder extends InvocationOnChangeProps {
  enum: EnumVar;
}
