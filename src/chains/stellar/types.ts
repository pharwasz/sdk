/** A hex-encoded string with 0x prefix. */
export type HexString = `0x${string}`;

/** Spending and viewing key pairs derived from a wallet signature. */
export interface StealthKeys {
  /** 32-byte spending seed (ed25519). */
  spendingKey: Uint8Array;
  /** Clamped spending scalar derived via SHA-512 from the seed. */
  spendingScalar: bigint;
  /** 32-byte viewing seed (ed25519). */
  viewingKey: Uint8Array;
  /** Clamped viewing scalar derived via SHA-512 from the seed. */
  viewingScalar: bigint;
  /** 32-byte spending public key (ed25519). */
  spendingPubKey: Uint8Array;
  /** 32-byte viewing public key (ed25519). */
  viewingPubKey: Uint8Array;
}

/** Parsed stealth meta-address components. */
export interface StealthMetaAddress {
  prefix: string;
  /** 32-byte spending public key. */
  spendingPubKey: Uint8Array;
  /** 32-byte viewing public key. */
  viewingPubKey: Uint8Array;
}

/** Result of generating a one-time stealth address for a recipient. */
export interface GeneratedStealthAddress {
  /** The Stellar public key (G...) of the stealth address. */
  stealthAddress: string;
  /** 32-byte ephemeral public key (ed25519). */
  ephemeralPubKey: Uint8Array;
  /** The 1-byte view tag (0–255). */
  viewTag: number;
}

/** A stealth payment announcement. */
export interface Announcement {
  /** Scheme identifier (1 for ed25519). */
  schemeId: number;
  /** The Stellar public key (G...) of the stealth address. */
  stealthAddress: string;
  /** The Stellar public key of the sender/caller. */
  caller: string;
  /** 32-byte ephemeral public key (hex-encoded). */
  ephemeralPubKey: string;
  /** Hex-encoded metadata (first byte is view tag). */
  metadata: string;
}

/**
 * An announcement that matched the recipient's viewing key.
 * Contains the stealth private scalar needed to spend.
 * Deriving this scalar requires the spending key — the viewing key alone
 * can only detect matches, not spend.
 */
export interface MatchedAnnouncement extends Announcement {
  /** The stealth private scalar: (spending_scalar + hash_scalar) mod L. */
  stealthPrivateScalar: bigint;
  /** 32-byte stealth public key bytes (for signing helper). */
  stealthPubKeyBytes: Uint8Array;
}

/** Payment details for a single stealth payment recipient. */
export interface StealthPayment {
  /** Recipient's stealth meta-address (st:xlm:...) */
  metaAddress: string;
  /** Amount in XLM (string to preserve precision) */
  amount: string;
}

/** Parameters for building a batch send transaction. */
export interface BuildBatchSendTxParams {
  /** Array of stealth payments to include in the batch */
  payments: StealthPayment[];
  /** Stellar source account object with sequence number */
  sourceAccount: any;
  /** Optional memo for the transaction */
  memo?: string;
  /** Network passphrase (e.g., 'Test SDF Network ; September 2015') */
  networkPassphrase: string;
  /** Base fee per operation in stroops (default: 100) */
  baseFee?: number;
  /** Maximum operations allowed per transaction (default: 100) */
  maxOperations?: number;
  /** Threshold for using stealth-batch-sender contract (default: 10) */
  batchSenderThreshold?: number;
  /** Optional stealth-batch-sender contract address */
  batchSenderContract?: string;
}

/** Result of building a batch send transaction. */
export interface BuildBatchSendTxResult {
  /** The built Stellar transaction (TransactionBuilder output) */
  transaction: any;
  /** Generated stealth addresses for each payment */
  stealthAddresses: GeneratedStealthAddress[];
  /** Total fee in stroops */
  totalFee: number;
  /** Whether stealth-batch-sender contract was used */
  usedBatchSender: boolean;
}
