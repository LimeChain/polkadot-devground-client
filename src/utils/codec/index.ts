import {
  AccountId,
  blockHeader,
  Bytes,
  enhanceDecoder,
  metadata,
  ScaleEnum,
  Struct,
  u8,
  Variant,
} from '@polkadot-api/substrate-bindings';
import { u32 } from 'scale-ts';

import {
  baseStoreChain,
  type StoreInterface,
} from '@stores';

import type { IBlockExtrinsic } from '@custom-types/block';
import type {
  getDynamicBuilder,
  MetadataLookup,
} from '@polkadot-api/metadata-builders';
import type {
  Enum,
  HexString,
  SS58String,
  StringRecord,
} from '@polkadot-api/substrate-bindings';
import type { Codec } from 'polkadot-api';

// ============================================================================
// CONSTANTS
// ============================================================================

/** Bit mask for extracting the signed flag from extrinsic header */
const EXTRINSIC_SIGNED_BIT = 0x80; // 128

/** Bit mask for extracting the version from extrinsic header */
const EXTRINSIC_VERSION_MASK = 0x7f; // 127

/** Standard signature lengths for different cryptographic schemes */
const SIGNATURE_LENGTHS = {
  ED25519: 64,
  SR25519: 64,
  ECDSA: 65,
} as const;

/** Default values for unknown method/section */
const UNKNOWN_METHOD = 'unknown';

/** Byte offset for skipping the header in extrinsic data */
const EXTRINSIC_HEADER_BYTE_OFFSET = 1;

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/** Extrinsic header containing version and signed flag */
interface ExtrinsicHeader {
  signed: boolean;
  version: number;
}

/** Supported sender address formats */
type SenderAddress = SS58String | HexString | Enum<{ Id: SS58String }>;

/** Raw decoded extrinsic data before transformation */
interface RawDecodedExtrinsic {
  version: number;
  signed: boolean;
  sender?: SenderAddress;
  call?: {
    type: string;
    value?: {
      type: string;
      value: unknown;
    };
  };
  callData: Uint8Array;
}

/** All codec components needed for extrinsic decoding */
interface ExtrinsicCodecComponents {
  headerDecoder: ReturnType<typeof createExtrinsicHeaderDecoder>;
  senderCodec: ReturnType<typeof createSenderCodec>;
  signatureCodec: ReturnType<typeof createSignatureCodecs>;
  extrasCodec: ReturnType<typeof createExtrasCodec>;
  callCodec: ReturnType<typeof createCallCodec>;
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validates required inputs for extrinsic decoding
 * @throws {Error} If any required input is missing or invalid
 */
const validateInputs = (
  extrinsic: string,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
): void => {
  if (!extrinsic || typeof extrinsic !== 'string') {
    throw new Error('Extrinsic data is required and must be a string');
  }
  if (!dynamicBuilder) {
    throw new Error('Dynamic builder is required');
  }
  if (!lookup) {
    throw new Error('Metadata lookup is required');
  }
};

// ============================================================================
// CODEC FACTORY FUNCTIONS
// ============================================================================

/**
 * Creates codec structures for decoding different signature types
 */
const createSignatureCodecs = (
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
) => {
  // Standard signature variants for different crypto schemes
  const standardSignature = Variant({
    Ed25519: Bytes(SIGNATURE_LENGTHS.ED25519),
    Sr25519: Bytes(SIGNATURE_LENGTHS.SR25519),
    Ecdsa: Bytes(SIGNATURE_LENGTHS.ECDSA),
  });

  return 'signature' in lookup.metadata.extrinsic
    ? (dynamicBuilder.buildDefinition(lookup.metadata.extrinsic.signature) as typeof standardSignature)
    : standardSignature;
};

/**
 * Creates codec for the sender address field
 */
const createSenderCodec = (
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
) => {
  return 'address' in lookup.metadata.extrinsic
    ? (dynamicBuilder.buildDefinition(lookup.metadata.extrinsic.address) as Codec<SenderAddress>)
    : AccountId();
};

/**
 * Creates codec for signed extensions (extra data)
 */
const createExtrasCodec = (
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
) => {
  return Struct(
    Object.fromEntries(
      lookup.metadata.extrinsic.signedExtensions.map((ext) => [
        ext.identifier,
        dynamicBuilder.buildDefinition(ext.type),
      ]),
    ) as StringRecord<Codec<any>>,
  );
};

/**
 * Creates codec for the call data
 */
const createCallCodec = (
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
) => {
  const callTypeId = 'call' in lookup.metadata.extrinsic
    ? lookup.metadata.extrinsic.call
    : lookup.metadata.extrinsic.type;

  return dynamicBuilder.buildDefinition(callTypeId) as Codec<{
    type: string;
    value: { type: string; value: unknown };
  }>;
};

/**
 * Decodes the extrinsic header byte to extract version and signed flag
 * According to Substrate spec: https://spec.polkadot.network/id-extrinsics#id-extrinsics-body
 */
const createExtrinsicHeaderDecoder = () => {
  return enhanceDecoder(u8.dec, (value): ExtrinsicHeader => ({
    signed: (value & EXTRINSIC_SIGNED_BIT) > 0,  // Most significant bit indicates if extrinsic is signed
    version: value & EXTRINSIC_VERSION_MASK,     // Remaining 7 bits contain the version
  }));
};

/**
 * Grouped codec factory functions for better organization
 */
const CodecFactories = {
  signature: createSignatureCodecs,
  sender: createSenderCodec,
  extras: createExtrasCodec,
  call: createCallCodec,
  header: createExtrinsicHeaderDecoder,
} as const;

// ============================================================================
// DATA TRANSFORMATION HELPERS
// ============================================================================

/**
 * Extracts method information from decoded call data
 */
const extractMethodInfo = (call?: RawDecodedExtrinsic['call']) => ({
  method: call?.value?.type || UNKNOWN_METHOD,
  section: call?.type || UNKNOWN_METHOD,
  args: call?.value?.value || {},
});

/**
 * Extracts and normalizes the signer information from decoded extrinsic
 */
const extractSigner = (sender: SenderAddress | undefined, signed: boolean) => {
  if (!signed || !sender) return undefined;

  if (typeof sender === 'string') {
    return { Id: sender };
  }

  if (typeof sender === 'object' && sender && 'type' in sender && sender.type === 'Id') {
    return { Id: sender.value };
  }

  return undefined;
};

/**
 * Transforms raw decoded extrinsic data into the expected IBlockExtrinsic format
 */
const transformToBlockExtrinsic = (decodedExtrinsic: RawDecodedExtrinsic): IBlockExtrinsic => {
  const sender = decodedExtrinsic.signed ? decodedExtrinsic.sender : undefined;

  return {
    isSigned: decodedExtrinsic.signed,
    method: extractMethodInfo(decodedExtrinsic.call),
    signer: extractSigner(sender, decodedExtrinsic.signed),
  };
};

// ============================================================================
// EXTRINSIC DECODING LOGIC
// ============================================================================

/**
 * Core extrinsic decoding logic extracted from enhanceDecoder
 * This pure function handles the actual byte parsing without codec wrapper
 */
const decodeExtrinsicBytes = (
  bytes: Uint8Array,
  components: ExtrinsicCodecComponents,
): RawDecodedExtrinsic => {
  const { headerDecoder, senderCodec, signatureCodec, extrasCodec, callCodec } = components;

  // Structure for signed extrinsics (v4 format)
  const signedExtrinsicCodec = Struct({
    sender: senderCodec,
    signature: signatureCodec,
    extra: extrasCodec,
    call: callCodec,
  });

  const header = headerDecoder(bytes);

  if (header.signed) {
    // Decode signed extrinsic (skip first byte which is the header)
    const payload = signedExtrinsicCodec.dec(bytes.slice(EXTRINSIC_HEADER_BYTE_OFFSET));
    return {
      version: header.version,
      signed: true,
      ...payload,
      callData: callCodec.enc(payload.call),
    };
  }

  // Decode unsigned extrinsic
  return {
    version: header.version,
    signed: false,
    call: callCodec.dec(bytes.slice(EXTRINSIC_HEADER_BYTE_OFFSET)),
    callData: bytes.slice(EXTRINSIC_HEADER_BYTE_OFFSET),
  };
};

// ============================================================================
// CODEC ASSEMBLY
// ============================================================================

/**
 * Creates all necessary codec components for extrinsic decoding
 */
const createCodecComponents = (
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
): ExtrinsicCodecComponents => ({
  headerDecoder: CodecFactories.header(),
  senderCodec: CodecFactories.sender(dynamicBuilder, lookup),
  signatureCodec: CodecFactories.signature(dynamicBuilder, lookup),
  extrasCodec: CodecFactories.extras(dynamicBuilder, lookup),
  callCodec: CodecFactories.call(dynamicBuilder, lookup),
});

/**
 * Creates the main extrinsic decoder using provided codec components
 * Now uses the extracted decoding logic for better separation of concerns
 */
const createMainExtrinsicDecoder = (components: ExtrinsicCodecComponents) => {
  return enhanceDecoder(Bytes().dec, (bytes: Uint8Array): RawDecodedExtrinsic =>
    decodeExtrinsicBytes(bytes, components),
  );
};

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Legacy extrinsic decoder using the registry
 * Falls back to this when the dynamic decoder fails
 */
export const decodeExtrinsic = (extrinsic: string): IBlockExtrinsic | undefined => {
  const registry = baseStoreChain.getState().registry as StoreInterface['registry'];
  try {
    return registry.createType('Extrinsic', extrinsic).toHuman() as unknown as IBlockExtrinsic;
  } catch (err) {
    return undefined;
  }
};

/**
 * Extrinsic decoder using dynamic metadata builders
 * 
 * @param extrinsic - Hex-encoded extrinsic data
 * @param dynamicBuilder - Dynamic metadata builder instance
 * @param lookup - Metadata lookup for type definitions
 * @returns Decoded extrinsic or undefined if decoding fails
 */
export const decodeExtrinsicImproved = (
  extrinsic: string,
  dynamicBuilder: ReturnType<typeof getDynamicBuilder>,
  lookup: MetadataLookup,
): IBlockExtrinsic | undefined => {
  try {
    // Validate all required inputs
    validateInputs(extrinsic, dynamicBuilder, lookup);

    // Create all codec components
    const codecComponents = createCodecComponents(dynamicBuilder, lookup);

    // Create the main decoder
    const extrinsicDecoder = createMainExtrinsicDecoder(codecComponents);

    // Decode the extrinsic
    const decodedExtrinsic = extrinsicDecoder(extrinsic);

    // Transform to expected interface
    return transformToBlockExtrinsic(decodedExtrinsic);
  } catch (err) {
    // Log warning for debugging but don't throw
    console.warn(
      'Dynamic extrinsic decoder failed:',
      err instanceof Error ? err.message : 'Unknown error',
    );

    // Fallback to legacy decoder if dynamic approach fails
    return decodeExtrinsic(extrinsic);
  }
};

// ============================================================================
// OTHER CODEC EXPORTS
// ============================================================================

export const babeDigestCodec = ScaleEnum({
  a: u32,
  b: u32,
  c: u32,
  d: u32,
});

export const blockHeaderCodec = blockHeader;
export const metadataCodec = metadata;
