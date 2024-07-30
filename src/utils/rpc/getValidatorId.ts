import {
  hexToU8a,
  u8aToHex,
  u8aToString,
} from '@polkadot/util';

import type { IBlock } from '@custom-types/block';

/**
 * Fetch the validator ID for a specific block number.
 *
 * @param {PolkadotClient} client - The PolkadotClient client instance to communicate with the blockchain.
 * @param {number} blockNumber - The number of the block to query.
 * @returns {Promise<string | null>} - The validator ID (public key) as a hex string, or null if not found.
 */
export const getValidatorId = async (block: IBlock): Promise<string | null> => {
  try {
    // The block header contains the digest where consensus information is stored
    const blockHeader = block.header;
    const digest = blockHeader.digest;

    // Decode the digest logs
    const logs = digest.logs.map((log: string) => {
      return hexToU8a(log);
    });

    let validatorId: string | null = null;
    logs.forEach((log: Uint8Array) => {
      // Checking if it's a BABE consensus log
      if (log[0] === 0x06 && u8aToString(log.slice(1, 5)) === 'BABE') {
        // Extract the validator's public key from the log
        // Adjust the index as necessary based on the actual structure of the log
        const authorityIndex = 32; // Example index, adjust as needed
        const publicKeyBytes = log.slice(authorityIndex, authorityIndex + 32); // Assuming 32 bytes for the public key
        validatorId = u8aToHex(publicKeyBytes); // Convert to hex string
      }
    });

    return validatorId;
  } catch (error) {
    return null;
  }
};
