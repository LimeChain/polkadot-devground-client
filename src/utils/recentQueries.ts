import { Binary } from 'polkadot-api';

import {
  STORAGE_LIMIT_RECENT_QUERIES,
  STORAGE_RECENT_QUERIES,
} from '@constants/recentQueries';
import {
  storageGetAllKeys,
  storageGetItem,
  storageRemoveItem,
  storageSetItem,
} from '@utils/storage';

import type { TSupportedChain } from '@custom-types/chain';
import type {
  TCategory,
  TQueryBase,
  TRecentQuery,
} from '@custom-types/recentQueries';

export const stringifyQuery = (_key: string, value: unknown) => {
  if (value instanceof Binary) {
    return { type: 'Binary', value: value.asHex() };
  }

  switch (typeof value) {
    case 'bigint':
      return { type: 'bigint', value: value.toString() };
    default:
      return value;
  }
};

export const destringifyQuery = (_key: string, value: { value: unknown; type: 'Binary' | 'bigint' }) => {
  if (value?.type) {
    switch (value.type) {
      case 'bigint':
        return BigInt(value.value as number);
      case 'Binary':
        return Binary.fromHex(value.value as string);
      default:
        break;
    }
  }

  return value;
};

const limitStoredQueries = async (chainId: TSupportedChain, category: TCategory) => {
  const storageKey = `${STORAGE_RECENT_QUERIES}-${chainId}-${category}`;
  const currentQueries = await storageGetAllKeys(storageKey);

  while (currentQueries.length > STORAGE_LIMIT_RECENT_QUERIES) {
    const querieToRemove = currentQueries.shift();

    if (querieToRemove) {
      void storageRemoveItem(storageKey, querieToRemove);
    }

  }
};

export const addRecentQuerieToStorage = async ({
  querie,
  chainId,
  category,
}: { querie: TQueryBase; chainId: TSupportedChain; category: TCategory }): Promise<void> => {
  const storageKey = `${STORAGE_RECENT_QUERIES}-${chainId}-${category}`;
  try {
    await storageSetItem(storageKey, querie.id,
      JSON.stringify(
        {
          ...querie,
          timestamp: Date.now(),
        },
        stringifyQuery,
      ),
    );
    void limitStoredQueries(chainId, category);
  } catch (error) {
    console.log(error);
  }
};

export const getRecentQueries = async ({
  chainId,
  category,
}: { chainId: TSupportedChain; category: TCategory }) => {
  const storageKey = `${STORAGE_RECENT_QUERIES}-${chainId}-${category}`;
  const queries = await storageGetAllKeys(storageKey);
  const promises = [];

  for (let i = queries.length - 1; i >= 0; i--) {
    promises.push(storageGetItem(storageKey, queries[i]));
  }

  return await Promise.all(promises)
    .then((results) => {
      return results.map((result) => (JSON.parse(result as string, destringifyQuery)) as TRecentQuery);
    })
    .catch((err) => {
      console.log('Unexpected recent queries fetch error', err);
      return [] as TRecentQuery[];
    });

};
