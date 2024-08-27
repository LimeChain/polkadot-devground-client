import type { ICallArgs } from '.';
import type {
  AccountId20,
  AccountId32,
} from '@polkadot-api/metadata-builders';

export interface IAccountParam extends ICallArgs {
  accountId: AccountId20 | AccountId32;
}

export const AccountParam = ({ accountId, onChange }: IAccountParam) => {

  return null;
};
